const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const machineDetails = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachineId },
    } = entry;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("daily update")) {
      throw new Error(Message.machineNotPermission);
    }

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vMachineId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "MachineModel",
      filter
    );
    if (!getRecordDetails) throw new Error(Message.recordNotFound);

    const result = {
      _id: getRecordDetails?._id,
      vMachinName: getRecordDetails?.vMachinName,
      iCalculateStitch: getRecordDetails?.iCalculateStitch,
      // iCalculateOldStitch: getRecordDetails?.iCalculateOldStitch,
      iMachineStatus: getRecordDetails?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("machineDetails----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = machineDetails;
