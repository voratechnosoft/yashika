const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vNotificationId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vNotificationId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblusers",
          localField: "vAdminId",
          foreignField: "_id",
          as: "adminData",
        },
      },
      {
        $unwind: {
          path: "$adminData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vTitle: 1,
          vMessage: 1,
          vTopic: 1,
          isAdminNotification: 1,
          iNotificationType: 1,
          vUserId: 1,
          vAdminId: 1,
          vAdminName: "$adminData.vName",
          vAdminImage: "$adminData.vProfileImage",
          iInquiryStatus: 1,
          vCatalogId: 1,
          vInquiryId: 1,
          isPending: 1,
          isStatus: 1,
          isDeleted: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
          vCreatedBy: 1,
          vUpdatedBy: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    let dataList = await dbService.aggregateData(
      "NotificationModel",
      aggregateQuery
    );

    let result = {};
    if (dataList[0]) {
      result = dataList[0];
    }

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
