const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const deleteMachine = async (antry) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachineId },
    } = antry;

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

    let checkData = await dbService.findOneRecord(
      "DailyUpdateModel",
      { vMachinId: new ObjectId(vMachineId), isDeleted: false },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.machineNotDelete);

    let condition = {
      _id: new ObjectId(vMachineId),
      isDeleted: false,
    };

    let checkMachineData = await dbService.findOneRecord(
      "MachineModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkMachineData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      isDeletedAt: Date.now(),
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

    return [];
  } catch (error) {
    console.error("deleteMachine----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteMachine;
