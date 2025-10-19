const Message = require("../../utils/messages.js");
const dbService = require("../../utils/dbService.js");
const constant = require("../../config/constants.js");

const onDeleteEmail = async (entry, res) => {
  try {
    let {
      query: { vEmail },
    } = entry;

    let condition = {
      vEmail: vEmail,
      isDeleted: false,
    };

    let user = await dbService.findOneRecord("UserModel", condition);
    if (!user) {
      throw new Error(Message.invalidEmail);
    }

    if (user?.isBlock) {
      throw new Error(Message.isAccountSuspended);
    }

    if (user?.iStatus === constant.USER_STATUS.SUSPEND) {
      throw new Error(Message.isAccountSuspended);
    }

    await dbService.deleteOneRecords("UserModel", condition);

    return {};
  } catch (error) {
    console.error("onDeleteEmail Error ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onDeleteEmail;
