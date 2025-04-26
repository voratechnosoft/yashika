const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const editAdminProfile = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      isAdmin: true,
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("UserModel", condition, {
      _id: 1,
      vProfileImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let profileUrlImage;
    if (Object.keys(file).length > 0) {
      profileUrlImage = "image/profile/" + file?.filename;
    }

    let updateData = {
      vName,
      vProfileImage: profileUrlImage
        ? profileUrlImage
        : checkData?.vProfileImage,
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

    const result = {
      vName: updateResponse?.vName,
      vMobile: updateResponse?.vMobile,
      arrUserAccess: updateResponse?.arrUserAccess,
      vUserRoleId: updateResponse?.vUserRoleId,
      vProfileImage: updateResponse?.vProfileImage,
      isBlock: updateResponse?.isBlock,
      isActive: updateResponse?.isActive,
      isDeleted: updateResponse?.isDeleted,
    };

    return result;
  } catch (error) {
    console.error("editAdminProfileError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = editAdminProfile;
