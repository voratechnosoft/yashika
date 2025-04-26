const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vWorkerName, vMobile},
    } = entry;

    let filter = {
      isDeleted: false,
      vWorkerName: vWorkerName,
    };

    let checkData = await dbService.findOneRecord("WorkerModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.workernameAlreadyExists);

    let payload = {
      vWorkerName,
      vMobile,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("WorkerModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vWorkerName: saveData?.vWorkerName,
      vMobile: saveData?.vMobile,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
