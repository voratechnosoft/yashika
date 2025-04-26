const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vFabricQuality },
    } = entry;

    let filter = {
      isDeleted: false,
      vFabricQuality: vFabricQuality,
    };

    let checkData = await dbService.findOneRecord("FabricModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.fabricQualityAlreadyExists);

    let payload = {
      vFabricQuality,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("FabricModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vFabricQuality: saveData?.vFabricQuality,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
