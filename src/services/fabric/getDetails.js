const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vFabricId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vFabricId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "FabricModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vFabricQuality: getRecordDetails?.vFabricQuality,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
