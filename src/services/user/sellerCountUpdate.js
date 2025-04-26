const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const sellerCountUpdate = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: { vCategoryId },
    } = payload;

    let filter = {
      _id: new ObjectId(vCategoryId),
      isDeleted: false,
    };

    let catalogData = await dbService.findOneRecord("CatalogModel", filter);
    if (!catalogData) throw new Error(Message.recordNotFound);

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "CatalogModel",
      filter,
      { $inc: { iSellerNumber: 1 } },
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      iSellerNumber: updateResponse?.iSellerNumber,
    };

    return result;
  } catch (error) {
    console.error("sellerCountUpdateError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = sellerCountUpdate;
