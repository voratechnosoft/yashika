const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
    } = entry;

    let filter = {
      isDeleted: false,
      vName: vName,
    };

    let checkData = await dbService.findOneRecord("FabricPannaModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.fusiontAlreadyExists);

    let payload = {
      vName,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord(
      "FabricPannaModel",
      payload
    );
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vName: saveData?.vName,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
