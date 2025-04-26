const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vMachineConditionId,
        vMachineName,
        iMachineNumber,
        iMachineStatus,
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vMachineConditionId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "MachineConditionModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      vMachineName,
      iMachineNumber,
      iMachineStatus,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "MachineConditionModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vMachineName: updateResponse?.vMachineName,
      iMachineNumber: updateResponse?.iMachineNumber,
      iMachineStatus: updateResponse?.iMachineStatus,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
