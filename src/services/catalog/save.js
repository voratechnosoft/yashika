const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");
const bwipjs = require("bwip-js");
const fs = require("fs");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { sendPushNotification } = require("../../utils/pushNotification");
const {
  generateBarcode,
  generateBarImage,
} = require("../../utils/generateRandom");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
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

    let checkCatalogData = await dbService.findOneRecord(
      "CatalogModel",
      { isDeleted: false, vDesignNumber: vDesignNumber },
      { _id: 1 }
    );
    if (checkCatalogData?._id)
      throw new Error(Message.designNumberAlreadyExists);

    let productImageArray = [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        productImageArray.push("image/catalog/" + files[i].filename);
      }
    }

    // const barCodeNumber = generateBarcode();
    const barCodeNumber = constants.BARCODE_NUMBER + vDesignNumber;
    let barcodePhoto = await generateBarImage(barCodeNumber);

    let payload = {
      vBarcodeId: barCodeNumber,
      vBarcodeImage: barcodePhoto,
      vDesignNumber: vDesignNumber,
      vFabricColor,
      vOtherColor,
      vFarmaRate,
      vFarmaRateWithStoan,
      vLessBorder,
      vLessBorderWithStoan,
      iPlainFabricRate,
      iFrameNumber,
      iFabricSale,
      vPlainMeter,
      vFabricPlainMeter,
      iProductStatus,
      arrProductImage: productImageArray,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    if (vCategoryId) {
      payload["vCategoryId"] = new ObjectId(vCategoryId);
    }

    if (vFusionId) {
      payload["vFusionId"] = new ObjectId(vFusionId);
    }

    if (vFabricId) {
      payload["vFabricId"] = new ObjectId(vFabricId);
    }

    if (vFabricPannaId) {
      payload["vFabricPannaId"] = new ObjectId(vFabricPannaId);
    }

    if (vFabricPlainIncludedId) {
      payload["vFabricPlainIncludedId"] = new ObjectId(vFabricPlainIncludedId);
    }

    if (vEmbroideryWorkHeightId) {
      payload["vEmbroideryWorkHeightId"] = new ObjectId(
        vEmbroideryWorkHeightId
      );
    }

    if (vPlainMeterId) {
      payload["vPlainMeterId"] = new ObjectId(vPlainMeterId);
    }

    let groupUserList = [];

    if (
      parseInt(iProductStatus) === constants?.PRODUCT_STATUS?.VISIBLE &&
      vGroupId !== "" &&
      vGroupId !== null &&
      vGroupId !== undefined
    ) {
      payload["vGroupId"] = new ObjectId(vGroupId);

      let groupData = await dbService.findOneRecord("GroupModel", {
        _id: new ObjectId(vGroupId),
      });

      groupUserList = groupData?.arrUserId;
    }

    const saveData = await dbService.createOneRecord("CatalogModel", payload);
    if (!saveData) throw new Error(Message.systemError);

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
              catalogId: saveData?._id,
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
      vDesignNumber: saveData?.vDesignNumber,
      iPlainFabricRate: saveData?.iPlainFabricRate,
      iProductStatus: saveData?.iProductStatus,
      isDeleted: saveData?.isDeleted,
      arrProductImage: saveData?.arrProductImage,
      vFabricPlainMeter: saveData?.vFabricPlainMeter,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
