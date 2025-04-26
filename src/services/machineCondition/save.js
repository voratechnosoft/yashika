const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachineName, iMachineNumber, iMachineStatus },
    } = entry;

    let filter = {
      isDeleted: false,
      vName: vName,
    };

    let checkData = await dbService.findOneRecord(
      "MachineConditionModel",
      filter,
      {
        _id: 1,
      }
    );
    if (checkData) throw new Error(Message.machineConditionAlreadyExists);

    let payload = {
      vMachineName,
      iMachineNumber,
      iMachineStatus,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord(
      "MachineConditionModel",
      payload
    );
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vMachineName: saveData?.vMachineName,
      iMachineNumber: saveData?.iMachineNumber,
      iMachineStatus: saveData?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
