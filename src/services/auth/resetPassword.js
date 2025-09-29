const ejs = require("ejs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Message = require("../../utils/messages.js");
const dbService = require("../../utils/dbService.js");
const constant = require("../../config/constants.js");
const { sendMail } = require("../../utils/sendMail.helper.js");
const { generateRandom } = require("../../utils/generateRandom.js");

const onReSetPassword = async (entry, res) => {
  try {
    let {
      body: { vEmail, vNewPassword },
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

    const comparePassword = await bcrypt.compare(vNewPassword, user?.vPassword);
    if (comparePassword) {
      throw new Error(Message.newPasswordMustBeDifferentFromCurrent);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(vNewPassword, salt);

    await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      { vPassword: hashedPassword, isBlock: false, isActive: false },
      {
        returnOriginal: false,
      }
    );

    return {};
  } catch (error) {
    console.error("onReSetPassword Error ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onReSetPassword;
