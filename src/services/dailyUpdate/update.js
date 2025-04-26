const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { formatDateString } = require("../../utils/generateRandom");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vDailyUpdateId,
        vMachinId,
        vWorkerId,
        vWorkingTime,
        vWorkingDay,
        vMachineCondition,
        vDescription = "",
        vRecordingLinkUrl = "",
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

    let condition = {
      _id: new ObjectId(vDailyUpdateId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "DailyUpdateModel",
      condition
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let machineData = await dbService.findOneRecord("MachineModel", {
      isDeleted: false,
      _id: new ObjectId(vMachinId),
    });

    if (!machineData) {
      throw new Error(Message.invalidMachineData);
    }

    let recordingUrl = vRecordingLinkUrl;
    if (Object.keys(file).length > 0) {
      recordingUrl = "recording/" + file?.filename;
    }

    let formateDate = "";
    if (vDate) {
      const formattedDate = formatDateString(vDate);
      formateDate = new Date(formattedDate).getTime();
    } else {
      formateDate = checkData?.vDate;
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

    let updateData = {
      vMachinId: new ObjectId(vMachinId),
      vWorkerId: new ObjectId(vWorkerId),
      vWorkingTime,
      vWorkingDay,
      vMachineCondition,
      vDescription: vDescription ? vDescription : "",
      vRecording: recordingUrl,
      iFrame,
      iThreadBreak,
      iCurrentStitch,
      iRunningStitch,
      iDesignNumber,
      iStopTimeHours,
      iStopTimeMinute,
      vDate: formateDate,
      iCalculateOldStitch: parseFloat(bonuceCalculate),
      iMachineCalculateStitch: parseFloat(machineData?.iCalculateStitch),
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "DailyUpdateModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vDescription: updateResponse?.vDescription,
      vRecording: updateResponse?.vRecording,
      iFrame: updateResponse?.iFrame,
      iThreadBreak: updateResponse?.iThreadBreak,
      iCurrentStitch: updateResponse?.iCurrentStitch,
      iRunningStitch: updateResponse?.iRunningStitch,
      iDesignNumber: updateResponse?.iDesignNumber,
      iStopTimeHours: updateResponse?.iStopTimeHours,
      iStopTimeMinute: updateResponse?.iStopTimeMinute,
      vDate: updateResponse?.vDate,
      isDeleted: updateResponse?.isDeleted,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
