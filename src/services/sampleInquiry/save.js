const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { sendPushNotification } = require("../../utils/pushNotification");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCatalogId,
        vMeter,
        vColor,
        vFabricQuality,
        vFabricPanna,
        vBorder,
        vExtraPlainFabric,
        vDescription,
        vFusion,
      },
    } = entry;

    let filterCondition = {
      _id: new ObjectId(userId),
      isDeleted: false,
      isAdmin: false,
    };

    let userData = await dbService.findOneRecord("UserModel", filterCondition, {
      _id: 1,
      vName: 1,
      vMobile: 1,
      vDeviceToken: 1,
    });
    if (!userData) throw new Error(Message.recordNotFound);

    let catalogData = await dbService.findOneRecord(
      "CatalogModel",
      {
        _id: new ObjectId(vCatalogId),
        isDeleted: false,
      },
      {
        _id: 1,
        vDesignNumber: 1,
      }
    );
    if (!catalogData) throw new Error(Message.catalogNotFound);

    const saveData = await dbService.createOneRecord("SampleInquiryModel", {
      vCatalogId: new ObjectId(vCatalogId),
      vMeter,
      vColor,
      vFabricQuality,
      vFabricPanna,
      vBorder,
      vExtraPlainFabric,
      vDescription,
      vFusion,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    let notification_object = {
      vUserId: new ObjectId(userId),
      vAdminId: null,
      isAdminNotification: false,
      iNotificationType: constants?.NOTIFICATION_TYPE?.INQURY,
      vTitle: "New Inquiry Request",
      vMessage: `${userData?.vName} has submitted an inquiry for catalog design number ${catalogData?.vDesignNumber}.`,
      vInquiryId: new ObjectId(saveData?._id),
      dtCreatedAt: Date.now(),
    };
    await dbService.createOneRecord("NotificationModel", notification_object);

    let adminData = await dbService.findAllRecords("UserModel", {
      isAdmin: true,
      isDeleted: false,
      isBlock: false,
      isActive: true,
    });

    const notificationPromises = adminData
      .filter((element) => element?.vDeviceToken) // Filter users with valid tokens
      .map((element) => {
        let notification_object = {
          title: "New Inquiry Request",
          description: `${userData?.vName} has submitted an inquiry for catalog design number ${catalogData?.vDesignNumber}.`,
          // userId: userId,
          adminId: element?._id,
          isAdminNotification: true,
          type: constants?.NOTIFICATION_TYPE?.INQURY,
          inquiryId: saveData?._id,
        };

        return sendPushNotification(
          element?.vDeviceToken,
          notification_object
        ).catch((error) =>
          console.error(
            `Failed to send notification to admin ${element?._id}:`,
            error
          )
        );
      });

    await Promise.all(notificationPromises);

    let result = {
      vMeter: saveData?.vMeter,
      vColor: saveData?.vColor,
      vFabricQuality: saveData?.vFabricQuality,
      vFabricPanna: saveData?.vFabricPanna,
      vBorder: saveData?.vBorder,
      vExtraPlainFabric: saveData?.vExtraPlainFabric,
      vDescription: saveData?.vDescription,
      vFusion: saveData?.vFusion,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
