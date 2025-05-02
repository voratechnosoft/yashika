const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");

const likeAndUnLikeCatalog = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vCatalogId, isLike = true },
    } = entry;

    let condition = {
      _id: new ObjectId(vCatalogId),
      iProductStatus: constants?.PRODUCT_STATUS?.VISIBLE,
      isDeleted: false,
    };

    let catalogExitData = await dbService.findOneRecord(
      "CatalogModel",
      condition
    );
    if (!catalogExitData) throw new Error(Message.recordNotFound);

    let favoriteArray = catalogExitData?.arrFavorites;

    if (isLike) {
      if (!favoriteArray.includes(userId)) {
        favoriteArray.push(new ObjectId(userId));
      }
    } else {
      favoriteArray = favoriteArray.filter(
        (item) => item.toString() !== userId.toString()
      );
    }

    let updateData = {
      arrFavorites: favoriteArray,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "CatalogModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      arrFavorites: updateResponse?.arrFavorites,
    };

    return result;
  } catch (error) {
    console.error("likeAndUnLikeCatalog Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = likeAndUnLikeCatalog;
