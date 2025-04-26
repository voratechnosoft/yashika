const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const getDetails = async (entry) => {
  try {
    let {
      body: { vMachineConditionId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vMachineConditionId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "MachineConditionModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vMachineName: getRecordDetails?.vMachineName,
      iMachineNumber: getRecordDetails?.iMachineNumber,
      iMachineStatus: getRecordDetails?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
