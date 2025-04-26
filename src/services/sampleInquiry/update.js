const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSampleInquiryId,
        vCatalogId,
        vMeter,
        vColor,
        vFabricQuality,
        vFabricPanna,
        vBorder,
        vExtraPlainFabric,
        vDescription,
        vFusion,
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vSampleInquiryId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "SampleInquiryModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let catalogData = await dbService.findOneRecord(
      "CatalogModel",
      {
        _id: new ObjectId(vCatalogId),
        isDeleted: false,
      },
      {
        _id: 1,
        vDesignNumber: 1,
      }
    );
    if (!catalogData) throw new Error(Message.catalogNotFound);

    let updateData = {
      vCatalogId: new ObjectId(vCatalogId),
      vMeter,
      vColor,
      vFabricQuality,
      vFabricPanna,
      vBorder,
      vExtraPlainFabric,
      vDescription,
      vFusion,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SampleInquiryModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vMeter: updateResponse?.vMeter,
      vColor: updateResponse?.vColor,
      vFabricQuality: updateResponse?.vFabricQuality,
      vFabricPanna: updateResponse?.vFabricPanna,
      vBorder: updateResponse?.vBorder,
      vExtraPlainFabric: updateResponse?.vExtraPlainFabric,
      vDescription: updateResponse?.vDescription,
      vFusion: saveData?.vFusion,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
