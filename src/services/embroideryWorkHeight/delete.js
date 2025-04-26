const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      body: { vEmbroideryWorkHeightId },
    } = entry;

    let condition = {
      _id: new ObjectId(vEmbroideryWorkHeightId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "CatalogModel",
      {
        vEmbroideryWorkHeightId: new ObjectId(vEmbroideryWorkHeightId),
        isDeleted: false,
      },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.embroideryWorkHeightNotDelete);

    let checkEmbroideryWorkHeightData = await dbService.findOneRecord(
      "EmbroideryWorkHeightModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkEmbroideryWorkHeightData?._id)
      throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "EmbroideryWorkHeightModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return {};
  } catch (error) {
    console.error("deleteDetailsError----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteDetails;
