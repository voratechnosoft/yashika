const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const saveMachine = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachinName, iCalculateStitch, iMachineStatus },
    } = entry;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("add machine")) {
      throw new Error(Message.machineNotPermission);
    }

    let filter = {
      isDeleted: false,
      vMachinName,
    };

    let checkData = await dbService.findOneRecord("MachineModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    const saveData = await dbService.createOneRecord("MachineModel", {
      vMachinName,
      iCalculateStitch,
      // iCalculateOldStitch: iCalculateStitch,
      iMachineStatus,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vMachinName: saveData?.vMachinName,
      iCalculateStitch: saveData?.iCalculateStitch,
      // iCalculateOldStitch: saveData?.iCalculateOldStitch,
      iMachineStatus: saveData?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("saveMachine----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = saveMachine;
