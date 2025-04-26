const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDetails = async (entry) => {
  try {
    let {
      body: { vFabricPannaId },
    } = entry;

    let condition = {
      _id: new ObjectId(vFabricPannaId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "CatalogModel",
      {
        vFabricPannaId: new ObjectId(vFabricPannaId),
        isDeleted: false,
      },
      {
        _id: 1,
      }
    );
    if (checkData?._id) throw new Error(Message.fusionNotDelete);

    let checkFusionData = await dbService.findOneRecord(
      "FabricPannaModel",
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
      "FabricPannaModel",
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
