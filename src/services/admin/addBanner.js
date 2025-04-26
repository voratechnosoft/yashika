const ObjectId = require("mongodb").ObjectId;
const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const constants = require("../../config/constants");

const addBanner = async (entry, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
      file,
    } = entry;

    let bannerUrlImage = "";
    if (Object.keys(file).length > 0) {
      bannerUrlImage = "image/banner/" + file?.filename;
    }

    let payload = {
      vName,
      vBannerImage: bannerUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("BannerModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    const result = {
      vName: saveData?.vName,
      vBannerImage: saveData?.vBannerImage,
    };

    return result;
  } catch (error) {
    console.error("addBannerError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = addBanner;
