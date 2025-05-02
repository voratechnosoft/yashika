const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");

const getDetails = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vCatalogId },
    } = entry;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("catalog")) {
      throw new Error(Message.catalogNotPermission);
    }

    let filter = {
      isDeleted: false,
      iProductStatus: constants?.PRODUCT_STATUS?.VISIBLE,
      _id: new ObjectId(vCatalogId),
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
          vCreatedBy: 1,
          vUpdatedBy: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "CatalogModel",
      aggregateQuery
    );

    let result = {};
    if (dataList?.length > 0) {
      result = dataList[0];
    }

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
