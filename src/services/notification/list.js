const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const paginationFn = require("../../utils/pagination");
const constants = require("../../config/constants");

const list = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSearchText = "",
        vNotificationType = false,
        iNotificationType = 0,
        iPage = 1,
        iLimit = 10,
      },
    } = entry;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

    let filter = {
      isDeleted: false,
      // isAdminNotification: vNotificationType,
    };

    if (!vNotificationType) {
      filter["vUserId"] = new ObjectId(userId);
    }

    if (parseInt(iNotificationType) === constants?.NOTIFICATION_TYPE?.DEFAULT) {
      if (vNotificationType) {
        filter["iNotificationType"] = {
          $in: [constants?.NOTIFICATION_TYPE?.INQURY],
        };
      } else {
        filter["iNotificationType"] = {
          $in: [
            constants?.NOTIFICATION_TYPE?.INQURY,
            constants?.NOTIFICATION_TYPE?.CATALOGUPDATE,
          ],
        };
      }
    } else {
      filter["iNotificationType"] = { $in: [iNotificationType] };
    }

    if (vSearchText) {
      var regex = new RegExp(vSearchText, "i");
      filter["$or"] = [{ vTitle: regex }];
    }

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
      { $sort: sortBy },
      // { $skip: noOfDocSkip },
      // { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData(
      "NotificationModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount("NotificationModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
