const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vGroupName, arrUserId },
      file,
    } = entry;

    let filter = {
      isDeleted: false,
      vName: vGroupName,
    };

    let checkData = await dbService.findOneRecord("GroupModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.groupAlreadyExists);

    let groupUrlImage = "";
    if (Object.keys(file).length > 0) {
      groupUrlImage = "image/group/" + file?.filename;
    }

    let payload = {
      vGroupName,
      arrUserId,
      vGroupImage: groupUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("GroupModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vGroupImage: saveData?.vGroupImage,
      vGroupName: saveData?.vGroupName,
      arrUserId: saveData?.arrUserId,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
