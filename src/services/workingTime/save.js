const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vTimeInHours, vTimeInMinutes },
    } = entry;

    let filter = {
      isDeleted: false,
      vTimeInHours: vTimeInHours,
    };

    let checkData = await dbService.findOneRecord("WorkingTimeModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.workingTimeAlreadyExists);

    let payload = {
      vTimeInHours,
      vTimeInMinutes,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord(
      "WorkingTimeModel",
      payload
    );
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vTimeInHours: saveData?.vTimeInHours,
      vTimeInMinutes: saveData?.vTimeInMinutes,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
