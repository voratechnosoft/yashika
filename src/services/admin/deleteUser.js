const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");

const deleteUser = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vUserId },
    } = entry;

    let condition = {
      _id: new ObjectId(vUserId),
      vCreatedBy: new ObjectId(userId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "GroupModel",
      { arrUserId: { $in: [new ObjectId(vUserId)] }, isDeleted: false },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.userNotDelete);

    let checkUserData = await dbService.findOneRecord("UserModel", condition, {
      _id: 1,
    });
    if (!checkUserData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
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

    return [];
  } catch (error) {
    console.error("deleteUserError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = deleteUser;
