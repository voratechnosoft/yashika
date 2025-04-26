const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constants = require("../../config/constants");

const addUser = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vName,
        vMobile,
        arrUserAccess = [],
        vUserRoleId,
        isAdmin = false,
        isActive = false,
      },
      file,
    } = entry;

    let condition = {
      vMobile: vMobile,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (userData) throw new Error(Message.mobileAlreadyExists);

    let profileUrlImage = "";
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

    let payload = {
      vName,
      vMobile,
      arrUserAccess: accessArrayList,
      vUserRoleId,
      vProfileImage: profileUrlImage,
      isAdmin: isAdmin,
      isBlock: isActive,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("UserModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    const result = {
      vName: saveData?.vName,
      vMobile: saveData?.vMobile,
      arrUserAccess: saveData?.arrUserAccess,
      vUserRoleId: saveData?.vUserRoleId,
      vProfileImage: saveData?.vProfileImage,
      isBlock: saveData?.isBlock,
      isActive: saveData?.isActive,
      isDeleted: saveData?.isDeleted,
      isAdmin: saveData?.isAdmin,
    };

    return result;
  } catch (error) {
    console.error("addUserError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = addUser;
