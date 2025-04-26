const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vDailyUpdateId },
    } = entry;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("daily update")) {
      throw new Error(Message.dailyUpdateNotPermission);
    }

    let condition = {
      _id: new ObjectId(vDailyUpdateId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "DailyUpdateModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "DailyUpdateModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteDetailsError----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteDetails;
