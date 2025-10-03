const ejs = require("ejs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Message = require("../../utils/messages");
const path = require("path");
const dbService = require("../../utils/dbService");
const constant = require("../../config/constants");
const { sendMail } = require("../../utils/sendMail.helper.js");
const { generateRandom } = require("../../utils/generateRandom");

const onRegister = async (entry, res) => {
  try {
    let {
      body: { vName, vEmail, vPassword, vMobile, vApkType },
    } = entry;

    let condition = {
      // vEmail: vEmail,
      vMobile: vMobile,
      isDeleted: false,
    };

    if (vApkType.toLowerCase() === "user") {
      condition["isAdmin"] = false;
    } else if (vApkType.toLowerCase() === "admin") {
      condition["isAdmin"] = true;
    } else {
      throw new Error(Message.invalidApkType);
    }

    let user = await dbService.findOneRecord("UserModel", condition);
    if (user) {
      throw new Error(Message.mobileAlreadyExists);
    }

    if (user?.isBlock) {
      throw new Error(Message.isAccountSuspended);
    }

    if (user?.iStatus === constant.USER_STATUS.SUSPEND) {
      throw new Error(Message.isAccountSuspended);
    }

    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expire in 10 minutes

    const templatePath = path.resolve(
      __dirname,
      "../../views/emails/sent_otp_email.ejs"
    );

    if (user && user.iStatus === constant.USER_STATUS.PENDING) {
      await dbService.findOneAndUpdateRecord(
        "UserModel",
        { _id: new ObjectId(userData._id) },
        {
          vEmailOtp: otp,
        },
        { new: true }
      );

      const mailFile = await ejs.renderFile(templatePath, {
        isRegister: true,
        isForgotPassword: false,
        vOtp: otp,
        vUserName: vName,
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

      let data = {
        dtExpireTime: expiresAt,
        vOtp: otp,
      };

      return data;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(vPassword, salt);

    let payload = {
      vName,
      vEmail,
      vPassword: hashedPassword,
      vMobile,
      vEmailOtp: otp,
      dtExpireTime: expiresAt,
      dtCreatedAt: Date.now(),
    };

    const saveUserData = await dbService.createOneRecord("UserModel", payload);
    if (!saveUserData) throw new Error(Message.systemError);

    const mailFile = await ejs.renderFile(templatePath, {
      isRegister: true,
      isForgotPassword: false,
      vOtp: otp,
      vUserName: vName,
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
      vOtp: otp,
      dtExpireTime: expiresAt,
    };

    return response;
  } catch (error) {
    console.error("onRegister Error ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onRegister;
