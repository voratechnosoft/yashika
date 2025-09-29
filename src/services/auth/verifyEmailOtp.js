const ObjectId = require("mongodb").ObjectId;
const ejs = require("ejs");
const path = require("path");
const Message = require("../../utils/messages");
const constant = require("../../config/constants");
const dbService = require("../../utils/dbService");
const moment = require("moment-timezone");
const generateJwtTokenFn = require("../../utils/generateJwtTokenFn");
const { sendMail } = require("../../utils/sendMail.helper.js");
const { formatDateString } = require("../../utils/generateRandom");

const verifyEmailOtp = async (entry) => {
  try {
    let {
      body: { vOtp, vEmail, isNewRegisterVerify = false },
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

    const currentTime = new Date();

    if (currentTime > userData?.dtExpireTime) {
      await dbService.findOneAndUpdateRecord(
        "UserModel",
        { _id: new ObjectId(userData._id) },
        {
          vEmailOtp: "",
        },
        { new: true }
      );
      throw new Error(Message.otpExpired);
    }

    if (userData?.vEmailOtp !== vOtp) {
      throw new Error(Message.invalidOTP);
    }

    let userDetails = await dbService.findOneAndUpdateRecord(
      "UserModel",
      { _id: userData._id },
      {
        vEmailOtp: "",
        dtExpireTime: 0,
        iStatus: constant.USER_STATUS.ACTIVE,
      },
      { new: true }
    );

    if (isNewRegisterVerify) {
      const templatePath = path.resolve(
        __dirname,
        "../../views/emails/new_user_register_email.ejs"
      );

      const date = userData.dtCreatedAt
        ? new Date(userData.dtCreatedAt)
        : new Date();
      const formattedDate = date.toISOString().split("T")[0];

      const mailFile = await ejs.renderFile(templatePath, {
        vUserName: userData.vName,
        vEmail: userData.vEmail,
        userCreatedDate: formattedDate,
      });

      const mailOptions = {
        from: process.env.SUPPORT_MAIL,
        to: userData.vEmail,
        subject: "New User Registered",
        html: mailFile,
      };
      sendMail(mailOptions);
    }

    const result = {
      _id: userData?._id,
      vName: userData?.vName,
      vEmail: userData?.vEmail,
      vMobile: userData?.vMobile,
      iStatus: userData?.iStatus,
    };

    return result;
  } catch (error) {
    console.error("verifyEmailOtpError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = verifyEmailOtp;
