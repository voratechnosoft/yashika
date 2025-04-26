const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      body: { vCategoryId },
    } = entry;

    let condition = {
      _id: new ObjectId(vCategoryId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "CatalogModel",
      { vCategoryId: new ObjectId(vCategoryId), isDeleted: false },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.categoryNotDelete);

    let checkCategoryData = await dbService.findOneRecord(
      "CategoryModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkCategoryData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "CategoryModel",
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
