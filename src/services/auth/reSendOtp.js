const ObjectId = require("mongodb").ObjectId;
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const path = require("path");
const crypto = require("crypto");
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constant = require("../../config/constants");
const { sendMail } = require("../../utils/sendMail.helper.js");
const { generateRandom } = require("../../utils/generateRandom");

const onReSendOtp = async (entry, res) => {
  try {
    let {
      body: { vEmail },
    } = entry;

    let condition = {
      vEmail: vEmail,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (!userData) throw new Error(Message.invalidEmail);

    if (userData?.isBlock) {
      throw new Error(Message.isAccountSuspended);
    }

    if (userData.iStatus === constant.USER_STATUS.SUSPEND) {
      throw new Error(Message.isAccountSuspended);
    }

    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await dbService.findOneAndUpdateRecord(
      "UserModel",
      { _id: new ObjectId(userData._id) },
      {
        vEmailOtp: otp,
        dtExpireTime: expiresAt,
      },
      { new: true }
    );

    const templatePath = path.resolve(
      __dirname,
      "../../views/emails/resend_otp_email.ejs"
    );

    const mailFile = await ejs.renderFile(templatePath, {
      vOtp: otp,
      vUserName: userData.vName,
      vEmail: vEmail,
      dtExpireTime: expiresAt,
    });

    const mailOptions = {
      from: `${process.env.SUPPORT_MAIL}`,
      to: `${vEmail}`,
      subject: "One-Time Password for register",
      html: mailFile,
    };
    sendMail(mailOptions);

    let response = {
      dtExpireTime: expiresAt,
      vOtp: otp,
    };

    return response;
  } catch (error) {
    console.error("onReSendOtp Error ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onReSendOtp;
