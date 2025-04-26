const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const encryptPassword = require("../../utils/encryptPassword");

const onAdminLogOut = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      // isAdmin: true,
      isDeleted: false,
    };

    let adminExitData = await dbService.findOneRecord("UserModel", condition);
    if (!adminExitData) throw new Error(Message.recordNotFound);

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      {
        vLoginToken: "",
        isBlock: false,
        isActive: false,
      },
      { returnOriginal: false }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return {};
  } catch (error) {
    console.error("onAdminLogOutError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onAdminLogOut;
