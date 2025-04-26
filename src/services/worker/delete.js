const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      body: { vWorkerId },
    } = entry;

    let condition = {
      _id: new ObjectId(vWorkerId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "DailyUpdateModel",
      { vWorkerId: new ObjectId(vWorkerId), isDeleted: false },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.workerNotDelete);

    let checkWorkerData = await dbService.findOneRecord(
      "WorkerModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkWorkerData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "WorkerModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteDetailsError----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteDetails;
