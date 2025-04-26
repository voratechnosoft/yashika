const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vCategoryId, vName, vCategoryLinkImage = "" },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vCategoryId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("CategoryModel", condition, {
      _id: 1,
      vCategoryImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let categoryUrlImage = vCategoryLinkImage;
    if (Object.keys(file).length > 0) {
      categoryUrlImage = "image/category/" + file?.filename;
    }

    let updateData = {
      vName,
      vCategoryImage: categoryUrlImage
        ? categoryUrlImage
        : checkData?.vCategoryImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
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

    let result = {
      vName: updateResponse?.vName,
      vCategoryImage: updateResponse?.vCategoryImage,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
