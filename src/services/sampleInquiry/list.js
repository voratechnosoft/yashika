const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const paginationFn = require("../../utils/pagination");

const sampleInquiryList = async (entry) => {
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
      vCreatedBy: new ObjectId(userId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblusers",
          localField: "vCreatedBy",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblusers",
          localField: "vUpdatedBy",
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
        $lookup: {
          from: "tblcatalogs",
          localField: "vCatalogId",
          foreignField: "_id",
          as: "catalogData",
        },
      },
      {
        $unwind: {
          path: "$catalogData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vMeter: 1,
          vColor: 1,
          vFabricQuality: 1,
          vFabricPanna: 1,
          vBorder: 1,
          vExtraPlainFabric: 1,
          vDescription: 1,
          vFusion: 1,
          iInquiryStatus: 1,
          vDate: 1,
          vReason: 1,
          vRecording: 1,
          vUserId: "$userData._id",
          vUserName: "$userData.vName",
          vUserNumber: "$userData.vMobile",
          vUserProfileImage: "$userData.vProfileImage",
          vAdminId: "$adminData._id",
          vAdminName: "$adminData.vName",
          vDesignNumber: "$catalogData.vDesignNumber",
          arrCatalogImage: "$catalogData.arrProductImage",
          vBarcodeId: "$catalogData.vBarcodeId",
          vCatalogId: 1,
          isDeleted: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
          vUpdatedBy: 1,
        },
      },
      { $sort: { _id: -1 } },
      // { $sort: sortBy },
      // { $skip: noOfDocSkip },
      // { $limit: docLimit },
    ];
    let dataList = await dbService.aggregateData(
      "SampleInquiryModel",
      aggregateQuery
    );

    let totalCount = await dbService.recordsCount("SampleInquiryModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = sampleInquiryList;
