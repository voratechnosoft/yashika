const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vFusionId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vFusionId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "FusionModel",
      filter
    );
    if (!getRecordDetails?._id) return {};

    const result = {
      _id: getRecordDetails?._id,
      vName: getRecordDetails?.vName,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
