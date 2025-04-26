const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constants = require("../../config/constants");

const updateUser = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vUserId,
        vName,
        vMobile,
        arrUserAccess = [],
        vUserRoleId,
        isActive = false,
        vProfileLinkImage = "",
      },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vUserId),
      vCreatedBy: new ObjectId(userId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("UserModel", condition, {
      _id: 1,
      vProfileImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let profileUrlImage = vProfileLinkImage;
    if (Object.keys(file).length > 0) {
      profileUrlImage = "image/profile/" + file?.filename;
    }

    let accessArrayList = [];
    if (vUserRoleId.toString() === constants?.ROLE_ID?.SUB_ADMIN) {
      accessArrayList = arrUserAccess;
    } else if (vUserRoleId.toString() === constants?.ROLE_ID?.SUB_ADMIN) {
      accessArrayList = [];
    } else {
      accessArrayList = ["catalog", "daily update", "add machine", "report"];
    }

    let updateData = {
      vName,
      vMobile,
      arrUserAccess,
      vUserRoleId,
      isBlock: isActive,
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
    console.error("updateUserError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = updateUser;
