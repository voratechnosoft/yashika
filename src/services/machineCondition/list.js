const dbService = require("../../utils/dbService");
const paginationFn = require("../../utils/pagination");

const list = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vSearchText = "", vDateTime = "", iPage = 1, iLimit = 10 },
    } = entry;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

    let filter = {
      isDeleted: false,
    };

    if (vDateTime) {
      let dateObject = new Date(vDateTime);
      let dateTime = dateObject.setSeconds(dateObject.getSeconds() + 1);

      filter["$or"] = [
        { dtCreatedAt: { $gt: dateTime } },
        { dtUpdatedAt: { $gt: dateTime } },
      ];
    }

    if (vSearchText) {
      var regex = new RegExp(vSearchText, "i");
      filter["$or"] = [{ vMachineName: regex }];
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vMachineName: 1,
          iMachineNumber: 1,
          iMachineStatus: 1,
        },
      },
      { $sort: { _id: -1 } },
      // { $sort: sortBy },
      // { $skip: noOfDocSkip },
      // { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData(
      "MachineConditionModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount(
      "MachineConditionModel",
      filter
    );

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
