const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vRoleId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vRoleId),
    };

    const getRecordDetails = await dbService.findOneRecord("RoleModel", filter);
    if (!getRecordDetails?._id) return [];

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
