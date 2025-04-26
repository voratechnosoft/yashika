const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteSampleInquiry = async (entry) => {
  try {
    let {
      body: { vSampleInquiryId },
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

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
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

    return [];
  } catch (error) {
    console.error("deleteSampleInquiryError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteSampleInquiry;
