const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      body: { vFabricPlainIncludedId },
    } = entry;

    let condition = {
      _id: new ObjectId(vFabricPlainIncludedId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "CatalogModel",
      {
        vFabricPlainIncludedId: new ObjectId(vFabricPlainIncludedId),
        isDeleted: false,
      },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.fusionNotDelete);

    let checkFusionData = await dbService.findOneRecord(
      "FabricPlainIncludedModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkFusionData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "FabricPlainIncludedModel",
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
