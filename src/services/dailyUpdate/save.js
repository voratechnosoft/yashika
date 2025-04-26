const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { formatDateString } = require("../../utils/generateRandom");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vMachinId,
        vWorkerId,
        vWorkingTime,
        vWorkingDay,
        vMachineCondition,
        vDescription = "",
        iFrame,
        iThreadBreak,
        iCurrentStitch,
        iRunningStitch,
        iDesignNumber,
        iStopTimeHours,
        iStopTimeMinute,
        vDate,
      },
      file,
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
      throw new Error(Message.dailyUpdateNotPermission);
    }

    let machineData = await dbService.findOneRecord("MachineModel", {
      isDeleted: false,
      _id: new ObjectId(vMachinId),
    });

    if (!machineData) {
      throw new Error(Message.invalidMachineData);
    }

    let recordingUrl = "";
    if (Object.keys(file).length > 0) {
      recordingUrl = "recording/" + file?.filename;
    }

    let formateDate = "";
    if (vDate) {
      const formattedDate = formatDateString(vDate);
      formateDate = new Date(formattedDate).getTime();
    } else {
      formateDate = Date.now();
    }

    let bonuceCalculate = 0;
    if (
      parseFloat(iCurrentStitch) > parseFloat(machineData?.iCalculateStitch)
    ) {
      bonuceCalculate =
        (parseFloat(iCurrentStitch) -
          parseFloat(machineData?.iCalculateStitch)) /
        1000;
    } else {
      bonuceCalculate = 0;
    }

    let payload = {
      vMachinId: new ObjectId(vMachinId),
      vWorkerId: new ObjectId(vWorkerId),
      vRecording: recordingUrl,
      vWorkingTime,
      vWorkingDay,
      vMachineCondition,
      vDescription: vDescription ? vDescription : "",
      iFrame,
      iThreadBreak,
      iCurrentStitch,
      iRunningStitch,
      iDesignNumber,
      iStopTimeHours,
      iStopTimeMinute,
      vDate,
      vDate: formateDate,
      iCalculateOldStitch: parseFloat(bonuceCalculate),
      iMachineCalculateStitch: parseFloat(machineData?.iCalculateStitch),
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord(
      "DailyUpdateModel",
      payload
    );
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vDescription: saveData?.vDescription,
      vRecording: saveData?.vRecording,
      iFrame: saveData?.iFrame,
      iThreadBreak: saveData?.iThreadBreak,
      iCurrentStitch: saveData?.iCurrentStitch,
      iRunningStitch: saveData?.iRunningStitch,
      iDesignNumber: saveData?.iDesignNumber,
      iStopTimeHours: saveData?.iStopTimeHours,
      iStopTimeMinute: saveData?.iStopTimeMinute,
      vDate: saveData?.vDate,
      isDeleted: saveData?.isDeleted,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
