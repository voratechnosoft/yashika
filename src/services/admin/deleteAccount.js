const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constants = require("../../config/constants");

const onDeleteAccount = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      isDeleted: false,
    };

    let userExitData = await dbService.findOneRecord("UserModel", condition);
    if (!userExitData) throw new Error(Message.recordNotFound);

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      {
        vLoginToken: "",
        isBlock: false,
        isActive: false,
        isDeleted: true,
        iStatus: constants.USER_STATUS.DELETE,
      },
      { returnOriginal: false }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return {};
  } catch (error) {
    console.error("onDeleteAccountError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onDeleteAccount;
