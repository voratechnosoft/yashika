const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const updateDeviceToken = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vDeviceToken },
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      isDeleted: false,
    };

    let adminExitData = await dbService.findOneRecord("UserModel", condition);
    if (!adminExitData) throw new Error(Message.recordNotFound);

    let updateData = {
      vDeviceToken: vDeviceToken,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vDeviceToken: updateResponse?.vDeviceToken,
    };

    return result;
  } catch (error) {
    console.error("updateDeviceToken Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = updateDeviceToken;
