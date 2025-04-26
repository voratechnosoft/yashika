const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vWorkingDayId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vWorkingDayId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "WorkingDayModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vWorkingName: getRecordDetails?.vWorkingName,
      vWorkingType: getRecordDetails?.vWorkingType,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
