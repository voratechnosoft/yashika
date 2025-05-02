const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const paginationFn = require("../../utils/pagination");

const getCategoryWiseCatalog = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vCategoryId, iPage = 1, iLimit = 10 },
    } = entry;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

    let filter = {
      isDeleted: false,
      iProductStatus: constants?.PRODUCT_STATUS?.VISIBLE,
      vCategoryId: new ObjectId(vCategoryId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblgroups",
          localField: "vGroupId",
          foreignField: "_id",
          as: "groupData",
        },
      },
      {
        $unwind: {
          path: "$groupData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userInGroup: {
            $cond: {
              if: {
                $gt: [{ $size: { $ifNull: ["$groupData.arrUserId", []] } }, 0],
              }, // Ensure array exists
              then: {
                $in: [
                  new ObjectId(userId),
                  { $ifNull: ["$groupData.arrUserId", []] },
                ],
              }, // Check if user is in group
              else: true, // If no group, allow all users
            },
          },
        },
      },
      {
        $match: {
          userInGroup: true, // Only allow if user is in the group or no group exists
        },
      },
      {
        $lookup: {
          from: "tblfusions",
          localField: "vFusionId",
          foreignField: "_id",
          as: "fusionData",
        },
      },
      {
        $unwind: {
          path: "$fusionData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabricpannas",
          localField: "vFabricPannaId",
          foreignField: "_id",
          as: "fabricPannaData",
        },
      },
      {
        $unwind: {
          path: "$fabricPannaData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabricplainincludeds",
          localField: "vFabricPlainIncludedId",
          foreignField: "_id",
          as: "fabricPlainIncludedData",
        },
      },
      {
        $unwind: {
          path: "$fabricPlainIncludedData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblembroideryworkheights",
          localField: "vEmbroideryWorkHeightId",
          foreignField: "_id",
          as: "embroideryWorkHeightData",
        },
      },
      {
        $unwind: {
          path: "$embroideryWorkHeightData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblplainmeters",
          localField: "vPlainMeterId",
          foreignField: "_id",
          as: "plainMeterData",
        },
      },
      {
        $unwind: {
          path: "$plainMeterData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabrics",
          localField: "vFabricId",
          foreignField: "_id",
          as: "fabricData",
        },
      },
      {
        $unwind: {
          path: "$fabricData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblcategories",
          localField: "vCategoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          isFavorite: {
            $cond: {
              if: {
                $in: [new ObjectId(userId), { $ifNull: ["$arrFavorites", []] }],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          iFrameNumber: 1,
          iPlainFabricRate: 1,
          iFabricSale: 1,
          iProductStatus: 1,
          arrProductImage: 1,
          vBarcodeId: 1,
          vBarcodeImage: 1,
          vDesignNumber: 1,
          arrFavorites: 1,
          vFabricId: 1,
          vFabricName: "$fabricData.vFabricQuality",
          vCategoryId: 1,
          vCategoryName: "$categoryData.vName",
          vFusionId: 1,
          vFusionName: "$fusionData.vName",
          vFabricPannaId: 1,
          vFabricPannaName: "$fabricPannaData.vName",
          vFabricPlainIncludedId: 1,
          vFabricPlainIncludedName: "$fabricPlainIncludedData.vName",
          vPlainMeter: 1,
          vPlainMeterId: 1,
          vPlainMeterName: "$plainMeterData.vName",
          vEmbroideryWorkHeightId: 1,
          vEmbroideryWorkName: "$embroideryWorkHeightData.vName",
          vGroupId: 1,
          vGroupName: "$groupData.vGroupName",
          vFabricColor: 1,
          vOtherColor: 1,
          vFarmaRate: 1,
          vFarmaRateWithStoan: 1,
          vLessBorder: 1,
          vLessBorderWithStoan: 1,
          vFabricPlainMeter: 1,
          isDeleted: 1,
          isFavorite: 1,
          vCreatedBy: 1,
          vUpdatedBy: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: sortBy },
      { $skip: noOfDocSkip },
      { $limit: docLimit },
    ];
    let getRecordDetails = await dbService.aggregateData(
      "CatalogModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount("CatalogModel", filter);

    return { data: getRecordDetails, iCount: totalCount };
  } catch (error) {
    console.error("getCategoryWiseCatalogError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getCategoryWiseCatalog;
