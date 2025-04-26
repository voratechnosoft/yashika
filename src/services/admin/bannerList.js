const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const bannerList = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = payload;

    let filterCondition = {
      isDeleted: false,
    };

    let aggregateQuery = [
      {
        $match: filterCondition,
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vBannerImage: 1,
          isDeleted: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    const dataList = await dbService.aggregateData(
      "BannerModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount(
      "BannerModel",
      filterCondition
    );
    if (!dataList) throw new Error(Message.systemError);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("bannerListError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = bannerList;
