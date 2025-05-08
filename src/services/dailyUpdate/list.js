const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const paginationFn = require("../../utils/pagination");
const { formatDateString } = require("../../utils/generateRandom");

const list = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        arrMachinId = [],
        arrWorkerId = [],
        arrWorkingTime = [],
        dtStart = "",
        dtEnd = "",
        iPage = 1,
        iLimit = 10,
      },
    } = entry;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

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
    };

    if (Array.isArray(arrMachinId) && arrMachinId.length > 0) {
      filter.vMachinId = { $in: arrMachinId.map((id) => new ObjectId(id)) };
    }

    if (Array.isArray(arrWorkerId) && arrWorkerId.length > 0) {
      filter.vWorkerId = { $in: arrWorkerId.map((id) => new ObjectId(id)) };
    }

    if (Array.isArray(arrWorkingTime) && arrWorkingTime.length > 0) {
      filter.vWorkingTime = { $in: arrWorkingTime };
    }

    if (dtStart || dtEnd) {
      filter.vDate = {};

      if (dtStart) {
        const startDateFormatted = formatDateString(dtStart);
        let newStartDate = new Date(startDateFormatted + "T00:00:00.000Z");
        filter.vDate.$gte = newStartDate.getTime();
      }

      if (dtEnd) {
        const endDateFormatted = formatDateString(dtEnd);
        let newEndDate = new Date(endDateFormatted + "T23:59:59.000Z");
        filter.vDate.$lte = newEndDate.getTime();
      }
    }

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
      { $sort: { _id: -1 } },
      // { $sort: sortBy },
      // { $skip: noOfDocSkip },
      // { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData(
      "DailyUpdateModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount("DailyUpdateModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
