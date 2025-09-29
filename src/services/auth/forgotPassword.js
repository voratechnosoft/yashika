const ObjectId = require("mongodb").ObjectId;
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const path = require("path");
const crypto = require("crypto");
const Message = require("../../utils/messages.js");
const dbService = require("../../utils/dbService.js");
const constant = require("../../config/constants.js");
const { sendMail } = require("../../utils/sendMail.helper.js");
const { generateRandom } = require("../../utils/generateRandom.js");

const onForgotPassword = async (entry, res) => {
  try {
    let {
      body: { vEmail },
    } = entry;

    let condition = {
      vEmail: vEmail,
      isDeleted: false,
    };

    let user = await dbService.findOneRecord("UserModel", condition);
    if (!user) {
      throw new Error(Message.invalidEmail);
    }

    if (user?.isBlock) {
      throw new Error(Message.isAccountSuspended);
    }

    if (user?.iStatus === constant.USER_STATUS.SUSPEND) {
      throw new Error(Message.isAccountSuspended);
    }

    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await dbService.findOneAndUpdateRecord(
      "UserModel",
      { _id: new ObjectId(user._id) },
      {
        vEmailOtp: otp,
        dtExpireTime: expiresAt,
      },
      { new: true }
    );

    const templatePath = path.resolve(
      __dirname,
      "../../views/emails/sent_otp_email.ejs"
    );

    const mailFile = await ejs.renderFile(templatePath, {
      emailFor: "reset-password-otp",
      isForgotPassword: true,
      isRegister: false,
      vOtp: otp,
      vUserName: user.vName,
      vEmail: vEmail,
      dtExpireTime: expiresAt,
    });

    const mailOptions = {
      from: `${process.env.SUPPORT_MAIL}`,
      to: `${vEmail}`,
      subject: "Reset Your Password",
      html: mailFile,
    };
    sendMail(mailOptions);

    let response = {
      vOtp: otp,
      dtExpireTime: expiresAt,
    };

    return response;
  } catch (error) {
    console.error("onForgotPassword Error ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onForgotPassword;
