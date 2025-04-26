const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const directLogOut = async (entry) => {
  try {
    let {
      user: { _id: userId },
      params: { number },
    } = entry;

    let condition = {
      vMobile: number,
      isDeleted: false,
    };

    let exitMobileData = await dbService.findOneRecord("UserModel", condition);
    if (!exitMobileData) throw new Error(Message.recordNotFound);

    let updateData = {
      vLoginToken: "",
      isBlock: false,
      isActive: false,
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
      vMobile: updateResponse?.vMobile,
    };

    return result;
  } catch (error) {
    console.error("directLogOut Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = directLogOut;
