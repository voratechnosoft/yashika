const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const paginationFn = require("../../utils/pagination");

const machineList = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vSearchText, iPage = 1, iLimit = 10 },
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
      throw new Error(Message.machineNotPermission);
    }

    let filter = {
      isDeleted: false,
    };

    if (vSearchText) {
      var regex = new RegExp(vSearchText, "i");
      filter["$or"] = [{ vMachinName: regex }];
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vMachinName: 1,
          iCalculateStitch: 1,
          // iCalculateOldStitch: 1,
          iMachineStatus: 1,
        },
      },
      { $sort: sortBy },
      { $skip: noOfDocSkip },
      { $limit: docLimit },
    ];

    let dataList = await dbService.aggregateData(
      "MachineModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount("MachineModel", filter);

    if (!dataList) throw new Error(Message.systemError);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("machineList----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = machineList;
