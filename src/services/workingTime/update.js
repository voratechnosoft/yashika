const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vWorkingTimeId, vTimeInHours, vTimeInMinutes },
    } = entry;

    let condition = {
      _id: new ObjectId(vWorkingTimeId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "WorkingTimeModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      vTimeInHours,
      vTimeInMinutes,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "WorkingTimeModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vTimeInHours: updateResponse?.vTimeInHours,
      vTimeInMinutes: updateResponse?.vTimeInMinutes,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
