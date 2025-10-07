const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const onChangePassword = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vOldPassword, vNewPassword },
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      isAdmin: true,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (!userData?._id) throw new Error(Message.recordNotFound);

    const isMatch = await bcrypt.compare(vOldPassword, userData.vPassword);
    if (!isMatch) throw new Error(Message.oldPasswordNotMatch);

    if (vOldPassword === vNewPassword)
      throw new Error(Message.newPasswordMatchOldPassword);

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(vNewPassword, salt);

    let updateData = {
      vPassword: newHashedPassword,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return {};
  } catch (error) {
    console.error("onChangePasswordError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onChangePassword;
