const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vEmbroideryWorkHeightId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vEmbroideryWorkHeightId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "EmbroideryWorkHeightModel",
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
