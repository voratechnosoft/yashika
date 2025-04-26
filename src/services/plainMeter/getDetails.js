const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vPlainMeterId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vPlainMeterId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "PlainMeterModel",
      filter
    );
    if (!getRecordDetails) throw new Error(Message.recordNotFound);

    const result = {
      _id: getRecordDetails?._id,
      vName: getRecordDetails?.vName,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
