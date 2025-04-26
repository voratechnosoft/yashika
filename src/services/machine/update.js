const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const updateMachine = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachineId, vMachinName, iCalculateStitch, iMachineStatus },
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

    let condition = {
      _id: new ObjectId(vMachineId),
      isDeleted: false,
    };

    let machineData = await dbService.findOneRecord("MachineModel", condition, {
      _id: 1,
    });
    if (!machineData) throw new Error(Message.recordNotFound);

    let updateData = {
      vMachinName,
      iCalculateStitch,
      iMachineStatus,
      isUpdatedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "MachineModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vMachinName: updateResponse?.vMachinName,
      iCalculateStitch: updateResponse?.iCalculateStitch,
      iMachineStatus: updateResponse?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("updateMachine----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = updateMachine;
