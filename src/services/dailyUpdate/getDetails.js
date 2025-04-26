const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vDailyUpdateId },
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

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vDailyUpdateId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblmachines",
          localField: "vMachinId",
          foreignField: "_id",
          as: "machinData",
        },
      },
      {
        $unwind: {
          path: "$machinData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblworkers",
          localField: "vWorkerId",
          foreignField: "_id",
          as: "workerData",
        },
      },
      {
        $unwind: {
          path: "$workerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $addFields: {
      //     bonusValue: {
      //       $cond: {
      //         if: {
      //           $gt: ["$iCurrentStitch", "$machinData.iCalculateOldStitch"],
      //         }, // Check if iCurrentStitch > calculateStitch
      //         then: {
      //           $divide: [
      //             {
      //               $subtract: [
      //                 "$iCurrentStitch",
      //                 "$machinData.iCalculateOldStitch",
      //               ],
      //             },
      //             1000,
      //           ],
      //         },
      //         else: 0, // If not greater, set to 0
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 1,
          vMachinId: 1,
          machinName: "$machinData.vMachinName",
          calculateStitch: "$iMachineCalculateStitch",
          iCalculateOldStitch: "$iMachineCalculateStitch",
          vWorkerId: 1,
          workerName: "$workerData.vWorkerName",
          vWorkingTime: 1,
          vWorkingDay: 1,
          vMachineCondition: 1,
          vDescription: 1,
          vRecording: 1,
          iFrame: 1,
          iThreadBreak: 1,
          iCurrentStitch: 1,
          iRunningStitch: 1,
          iDesignNumber: 1,
          iStopTimeHours: 1,
          iStopTimeMinute: 1,
          vDate: 1,
          isDeleted: 1,
          dtUpdate: 1,
          dtCreatedAt: 1, // Include dtCreatedAt
          bonusValue: "$iCalculateOldStitch",
        },
      },
      { $sort: sortBy },
      { $skip: noOfDocSkip },
      { $limit: docLimit },
    ];
    let getRecordDetails = await dbService.aggregateData(
      "DailyUpdateModel",
      aggregateQuery
    );

    if (!getRecordDetails?.length === 0) return {};

    const result = getRecordDetails[0];

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
