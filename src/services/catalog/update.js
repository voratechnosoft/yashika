const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { generateBarImage } = require("../../utils/generateRandom");
const { sendPushNotification } = require("../../utils/pushNotification");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCatalogId,
        vDesignNumber,
        vCategoryId = "",
        vFusionId = "",
        vFabricId = "",
        vFabricColor = "",
        vOtherColor = "",
        vFabricPannaId = "",
        vEmbroideryWorkHeightId = "",
        vFarmaRate = "",
        vFarmaRateWithStoan = "",
        vLessBorder = "",
        vLessBorderWithStoan = "",
        vPlainMeterId = "",
        vPlainMeter = "",
        vFabricPlainIncludedId = "",
        iPlainFabricRate = "",
        iFrameNumber = "",
        iFabricSale = "",
        iProductStatus = "",
        vGroupId = "",
        vFabricPlainMeter = "",
        arrProductUrlImage = [],
      },
      files,
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("catalog")) {
      throw new Error(Message.catalogNotPermission);
    }

    let condition = {
      _id: new ObjectId(vCatalogId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("CatalogModel", condition);
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let productImageArray = arrProductUrlImage;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let newImageArray = "image/catalog/" + files[i].filename;
        productImageArray = productImageArray.concat(newImageArray);
      }
    }

    const barCodeNumber = constants.BARCODE_NUMBER + vDesignNumber;
    let barcodePhoto = await generateBarImage(barCodeNumber);

    let updateData = {
      vBarcodeId: barCodeNumber,
      vBarcodeImage: barcodePhoto,
      vDesignNumber: vDesignNumber,
      vFabricColor: vFabricColor ? vFabricColor : checkData?.vFabricColor,
      vOtherColor: vOtherColor ? vOtherColor : checkData?.vOtherColor,
      vFarmaRate: vFarmaRate ? vFarmaRate : checkData?.vFarmaRate,
      vFarmaRateWithStoan: vFarmaRateWithStoan
        ? vFarmaRateWithStoan
        : checkData?.vFarmaRateWithStoan,
      vLessBorder: vLessBorder ? vLessBorder : checkData?.vLessBorder,
      vLessBorderWithStoan: vLessBorderWithStoan
        ? vLessBorderWithStoan
        : checkData?.vLessBorderWithStoan,
      iPlainFabricRate: iPlainFabricRate
        ? iPlainFabricRate
        : checkData?.iPlainFabricRate,
      iFrameNumber: iFrameNumber ? iFrameNumber : checkData?.iFrameNumber,
      iFabricSale: iFabricSale ? iFabricSale : checkData?.iFabricSale,
      vPlainMeter: vPlainMeter ? vPlainMeter : checkData?.vPlainMeter,
      vFabricPlainMeter: vFabricPlainMeter
        ? vFabricPlainMeter
        : checkData?.vFabricPlainMeter,
      iProductStatus: iProductStatus
        ? iProductStatus
        : checkData?.iProductStatus,
      arrProductImage:
        productImageArray?.length > 0
          ? productImageArray
          : checkData?.arrProductImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    if (vCategoryId) {
      updateData["vCategoryId"] = new ObjectId(vCategoryId);
    }

    if (vFusionId) {
      updateData["vFusionId"] = new ObjectId(vFusionId);
    }

    if (vFabricId) {
      updateData["vFabricId"] = new ObjectId(vFabricId);
    }

    if (vFabricPannaId) {
      updateData["vFabricPannaId"] = new ObjectId(vFabricPannaId);
    }

    if (vFabricPlainIncludedId) {
      updateData["vFabricPlainIncludedId"] = new ObjectId(
        vFabricPlainIncludedId
      );
    }

    if (vEmbroideryWorkHeightId) {
      updateData["vEmbroideryWorkHeightId"] = new ObjectId(
        vEmbroideryWorkHeightId
      );
    }

    if (vPlainMeterId) {
      updateData["vPlainMeterId"] = new ObjectId(vPlainMeterId);
    }

    let groupUserList = [];

    if (
      iProductStatus &&
      parseInt(iProductStatus) === constants?.PRODUCT_STATUS?.INVISIBLE
    ) {
      updateData["vGroupId"] = null;
    } else if (
      iProductStatus &&
      parseInt(iProductStatus) === constants?.PRODUCT_STATUS?.VISIBLE &&
      vGroupId !== "" &&
      vGroupId !== null &&
      vGroupId !== undefined
    ) {
      updateData["vGroupId"] = new ObjectId(vGroupId);

      let groupData = await dbService.findOneRecord("GroupModel", {
        _id: new ObjectId(vGroupId),
      });

      groupUserList = groupData?.arrUserId;
    }

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "CatalogModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    if (groupUserList?.length > 0) {
      let userData = await dbService.findAllRecords("UserModel", {
        _id: { $in: groupUserList.map((id) => new ObjectId(id)) },
        isDeleted: false,
        isBlock: false,
        isAdmin: false,
        isActive: true,
      });

      if (userData?.length > 0) {
        const notificationPromises = userData
          .filter((element) => element?.vDeviceToken) // Filter users with valid tokens
          .map((element) => {
            let notification_object = {
              title: "New Catalog",
              description: `New Catalog Add by Admin (D.N. ${vDesignNumber}).`,
              userId: element?._id,
              adminId: userId,
              isAdminNotification: false,
              type: constants.NOTIFICATION_TYPE.CATALOGUPDATE,
              catalogId: vCatalogId,
            };

            return sendPushNotification(
              element?.vDeviceToken,
              notification_object
            ).catch((error) =>
              console.error(
                `Failed to send notification to user ${element?._id}:`,
                error
              )
            );
          });

        await Promise.all(notificationPromises);
      }
    }

    let result = {
      vDesignNumber: updateResponse?.vDesignNumber,
      iPlainFabricRate: updateResponse?.iPlainFabricRate,
      iProductStatus: updateResponse?.iProductStatus,
      isDeleted: updateResponse?.isDeleted,
      vFabricPlainMeter: updateResponse?.vFabricPlainMeter,
      arrProductImage: updateResponse?.arrProductImage,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
