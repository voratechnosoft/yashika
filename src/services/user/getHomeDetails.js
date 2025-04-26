const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getHomeDetails = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: { vCategoryId = "", vFabricId = "", vDesignNumber = "" },
    } = payload;

    let filterCondition = {
      _id: new ObjectId(userId),
      isDeleted: false,
      isAdmin: false,
    };

    let userData = await dbService.findOneRecord("UserModel", filterCondition, {
      _id: 1,
    });
    if (!userData) throw new Error(Message.recordNotFound);

    let categoryFilter = {
      isDeleted: false,
    };

    let trendingFilter = {
      isDeleted: false,
    };

    let sellerFilter = {
      isDeleted: false,
    };

    if (vCategoryId) {
      categoryFilter["_id"] = new ObjectId(vCategoryId);
      trendingFilter["vCategoryId"] = new ObjectId(vCategoryId);
      sellerFilter["vCategoryId"] = new ObjectId(vCategoryId);
    }

    if (vFabricId) {
      trendingFilter["vFabricId"] = new ObjectId(vFabricId);
      sellerFilter["vFabricId"] = new ObjectId(vFabricId);
    }

    if (vDesignNumber) {
      trendingFilter["vDesignNumber"] = vDesignNumber;
      sellerFilter["vDesignNumber"] = vDesignNumber;
    }

    // Banner List
    let aggregateBannerQuery = [
      {
        $match: { isDeleted: false },
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
      { $limit: 5 },
    ];

    const bannerDataList = await dbService.aggregateData(
      "BannerModel",
      aggregateBannerQuery
    );

    // Category List
    let aggregateCategoryQuery = [
      {
        $match: categoryFilter,
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vCategoryImage: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let categoryData = await dbService.aggregateData(
      "CategoryModel",
      aggregateCategoryQuery
    );

    // Trending List
    let aggregateTrendingQuery = [
      {
        $match: trendingFilter,
      },
      {
        $sample: { size: 10 },
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
      { $sort: { _id: -1 } },
      { $limit: 10 },
    ];
    const trendingData = await dbService.aggregateData(
      "CatalogModel",
      aggregateTrendingQuery
    );

    // Seller List
    let aggregateSellerQuery = [
      {
        $match: sellerFilter,
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
      { $sort: { iSellerNumber: -1 } },
      { $limit: 10 },
    ];
    let sellerData = await dbService.aggregateData(
      "CatalogModel",
      aggregateSellerQuery
    );

    let result = {
      categoryList: categoryData,
      bannerList: bannerDataList,
      sellerList: sellerData,
      trendingList: trendingData,
    };

    return result;
  } catch (error) {
    console.error("getHomeDetailsError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = getHomeDetails;
