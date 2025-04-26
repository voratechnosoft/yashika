const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const moment = require("moment-timezone");
const generateJwtTokenFn = require("../../utils/generateJwtTokenFn");

const verifyMobileOtp = async (entry) => {
  try {
    let {
      body: { vOtp, vMobile },
    } = entry;

    let condition = {
      vMobile: vMobile,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (!userData) throw new Error(Message.invalidMobile);

    if (userData?.isBlock) {
      throw new Error(Message.isUserBlock);
    }

    const currentTime = new Date();

    if (currentTime > userData?.dtExpireTime) {
      await dbService.findOneAndUpdateRecord(
        "UserModel",
        { _id: new ObjectId(userData._id) },
        {
          vPhoneOtp: "",
        },
        { new: true }
      );
      throw new Error(Message.otpExpired);
    }

    if (userData?.vPhoneOtp !== vOtp) {
      throw new Error(Message.invalidOTP);
    }

    let timezoneOffset =
      moment.tz("America/New_York").format("Z") + "~America/New_York";

    let userDetails = await dbService.findOneAndUpdateRecord(
      "UserModel",
      { _id: userData._id },
      {
        vLoginToken: await generateJwtTokenFn({
          userId: userData["_id"],
          timezoneOffset,
          type: "app",
        }),
        vPhoneOtp: "",
        dtExpireTime: 0,
        isActive: true,
      },
      { new: true }
    );

    const result = {
      _id: userDetails?._id,
      vName: userDetails?.vName,
      vMobile: userDetails?.vMobile,
      vLoginToken: userDetails?.vLoginToken,
    };

    return result;
  } catch (error) {
    console.error("verifyMobileOtpError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = verifyMobileOtp;
