const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vWorkerId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vWorkerId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "WorkerModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vWorkerName: getRecordDetails?.vWorkerName,
      vMobile: getRecordDetails?.vMobile,
      vWorkerImage: getRecordDetails?.vWorkerImage,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
