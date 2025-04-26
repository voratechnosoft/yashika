const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constants = require("../../config/constants");
const { sendPushNotification } = require("../../utils/pushNotification");

const updateInquiryStatus = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vInquiryId, updateInquiryStatus, vDate = "", vReason = "" },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vInquiryId),
      isDeleted: false,
    };

    let adminData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(userId),
        isDeleted: false,
        isAdmin: true,
      },
      {
        _id: 1,
        vName: 1,
        vMobile: 1,
        vDeviceToken: 1,
      }
    );
    if (!adminData?._id) throw new Error(Message.adminNotFound);

    let checkData = await dbService.findOneRecord(
      "SampleInquiryModel",
      condition,
      {
        _id: 1,
        vCreatedBy: 1,
        vCatalogId: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let recordingUrl = "";
    if (Object.keys(file).length > 0) {
      recordingUrl = "recording/" + file?.filename;
    }

    let updateData = {
      iInquiryStatus: parseInt(updateInquiryStatus),
      vDate: vDate,
      vReason: vReason,
      vRecording: recordingUrl,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SampleInquiryModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let userData = await dbService.findOneRecord("UserModel", {
      _id: new ObjectId(checkData?.vCreatedBy),
      isDeleted: false,
      isAdmin: false,
      isBlock: false,
      isActive: true,
    });

    let catalogData = await dbService.findOneRecord(
      "CatalogModel",
      {
        _id: new ObjectId(checkData?.vCatalogId),
        isDeleted: false,
      },
      {
        _id: 1,
        vDesignNumber: 1,
      }
    );

    let statusText = "";
    if (updateInquiryStatus === 2) {
      statusText = "Approved";
    } else {
      statusText = "Reject";
    }

    if (
      userData?.vDeviceToken !== undefined &&
      userData?.vDeviceToken !== null &&
      userData?.vDeviceToken !== ""
    ) {
      let notification_object = {
        title: "Update Inquiry Request By Admin",
        description: `${
          Object.keys(catalogData).length > 0 ? catalogData?.vDesignNumber : 0
        } Design Number ${statusText} your Inquiry By ${adminData?.vName}.`,
        userId: userData?._id,
        adminId: userId,
        isAdminNotification: false,
        type: constants?.NOTIFICATION_TYPE?.INQURY,
        iInquiryStatus: updateResponse?.iInquiryStatus,
        inquiryId: vInquiryId,
      };

      sendPushNotification(userData?.vDeviceToken, notification_object);
    }

    const result = {
      vMeter: updateResponse?.vMeter,
      vColor: updateResponse?.vColor,
      vFabricQuality: updateResponse?.vFabricQuality,
      vFabricPanna: updateResponse?.vFabricPanna,
      vBorder: updateResponse?.vBorder,
      vExtraPlainFabric: updateResponse?.vExtraPlainFabric,
      vDescription: updateResponse?.vDescription,
      iInquiryStatus: updateResponse?.iInquiryStatus,
      vReason: updateResponse?.vReason,
      vDate: updateResponse?.vDate,
      isDeleted: updateResponse?.isDeleted,
    };

    return result;
  } catch (error) {
    console.error("updateInquiryStatusError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = updateInquiryStatus;
