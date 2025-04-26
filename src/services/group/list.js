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
      filter["$or"] = [{ vGroupName: regex }];
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblusers",
          let: { userIds: "$arrUserId" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$userIds"] }, // Match if _id is in arrUserId
              },
            },
            {
              $project: {
                _id: 1,
                vName: 1,
                vMobile: 1,
                arrUserAccess: 1,
                vProfileImage: 1,
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $project: {
          _id: 1,
          vGroupName: 1,
          arrUserId: 1,
          vGroupImage: 1,
          userData: 1,
        },
      },
      { $sort: sortBy },
      { $skip: noOfDocSkip },
      { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData("GroupModel", aggregateQuery);

    let totalCount = await dbService.recordsCount("GroupModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
