const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vWorkingName, vWorkingType },
    } = entry;

    let filter = {
      isDeleted: false,
      vWorkingName: vWorkingName,
    };

    let checkData = await dbService.findOneRecord("WorkingDayModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.workingDayAlreadyExists);

    let payload = {
      vWorkingName,
      vWorkingType,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord(
      "WorkingDayModel",
      payload
    );
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vWorkingName: saveData?.vWorkingName,
      vWorkingType: saveData?.vWorkingType,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
