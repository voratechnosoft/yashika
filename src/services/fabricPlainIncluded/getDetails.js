const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vFabricPlainIncludedId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vFabricPlainIncludedId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "FabricPlainIncludedModel",
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
