const dbService = require("../../utils/dbService");
const paginationFn = require("../../utils/pagination");

const list = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vSearchText = "", iPage = 1, iLimit = 10 },
    } = entry;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

    let filter = {
      isDeleted: false,
    };

    if (vSearchText) {
      var regex = new RegExp(vSearchText, "i");
      filter["$or"] = [{ vName: regex }, { iHeight: parseInt(regex) }];
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vName: 1,
        },
      },
      { $sort: { _id: -1 } },
      // { $sort: sortBy },
      // { $skip: noOfDocSkip },
      // { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData(
      "EmbroideryWorkHeightModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount(
      "EmbroideryWorkHeightModel",
      filter
    );

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
