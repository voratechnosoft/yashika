const ObjectId = require("mongodb").ObjectId;
const admin = require("firebase-admin");
const serviceAccount = require("./yashika-app-b867e-firebase-adminsdk-fbsvc-73c46e46bc.json");
const Message = require("./messages");
const dbService = require("./dbService");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (registrationToken, payload) => {
  try {
    if (!registrationToken) {
      throw new Error("Device Token is required");
    }

    const message = {
      notification: {
        title: payload.title ? payload.title : "Notification",
        body: payload.description ? payload.description : "Notification Send",
      },
      data: {
        catalogId: payload?.catalogId ? payload?.catalogId.toString() : "",
        inquiryId: payload?.inquiryId ? payload?.inquiryId.toString() : "",
        notificationType: payload?.type ? payload?.type.toString() : "",
        iInquiryStatus: payload?.iInquiryStatus
          ? payload?.iInquiryStatus.toString()
          : "",
      },
      token: registrationToken,
    };

    return admin
      .messaging()
      .send(message)
      .then(async (response) => {
        let notification_object = {
          vUserId: payload?.userId ? new ObjectId(payload?.userId) : null,
          vAdminId: payload?.adminId ? new ObjectId(payload?.adminId) : null,
          isAdminNotification: payload?.isAdminNotification
            ? payload?.isAdminNotification
            : false,
          iNotificationType: payload?.type,
          vTitle: payload?.title,
          vMessage: payload?.description,
          vCatalogId: payload?.catalogId
            ? new ObjectId(payload?.catalogId)
            : null,
          vInquiryId: payload?.inquiryId
            ? new ObjectId(payload?.inquiryId)
            : null,
          iInquiryStatus: payload?.iInquiryStatus
            ? payload?.iInquiryStatus.toString()
            : "",
          dtCreatedAt: Date.now(),
        };

        let notificationAdd = await dbService.createOneRecord(
          "NotificationModel",
          notification_object
        );

        return notificationAdd;
      })
      .catch((error) => {
        console.error("Error sending notification ------------->", error);
        throw new Error(Message.unexpectedDataError);
      });
  } catch (error) {
    console.error("sendPushNotification Error ------------->", error.message);
    throw new Error(Message.unexpectedDataError);
  }
};

module.exports = {
  sendPushNotification,
};
