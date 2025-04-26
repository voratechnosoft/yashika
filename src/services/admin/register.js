const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const encryptPassword = require("../../utils/encryptPassword");

const onAdminRegister = async (entry, res) => {
  try {
    let {
      body: { vName, vMobile },
    } = entry;

    let condition = {
      vMobile: vMobile,
      isDeleted: false,
    };

    let adminExitData = await dbService.findOneRecord("UserModel", {
      isDeleted: false,
    });
    if (adminExitData) throw new Error(Message.adminAlreadyExists);

    let adminData = await dbService.findOneRecord("UserModel", condition);
    if (adminData) throw new Error(Message.mobileAlreadyExists);

    let payload = {
      vName,
      vMobile,
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("UserModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    const result = {
      vName: saveData?.vName,
      vMobile: saveData?.vMobile,
    };

    return result;
  } catch (error) {
    console.error("onAdminRegisterError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onAdminRegister;
