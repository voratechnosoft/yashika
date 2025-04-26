const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
      file,
    } = entry;

    let filter = {
      isDeleted: false,
      vName: vName,
    };

    let checkData = await dbService.findOneRecord("CategoryModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.categoryAlreadyExists);

    let categoryUrlImage = "";
    if (Object.keys(file).length > 0) {
      categoryUrlImage = "image/category/" + file?.filename;
    }

    let payload = {
      vName,
      vCategoryImage: categoryUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("CategoryModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vCategoryImage: saveData?.vCategoryImage,
      vName: saveData?.vName,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
