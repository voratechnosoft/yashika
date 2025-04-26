const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vCategoryId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vCategoryId),
    };

    let categoryData = await dbService.findOneRecord("CategoryModel", filter, {
      _id: 1,
    });
    if (!categoryData) throw new Error(Message.recordNotFound);

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vCategoryImage: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let getRecordDetails = await dbService.aggregateData(
      "CategoryModel",
      aggregateQuery
    );

    if (!getRecordDetails?.length === 0) return {};

    const result = getRecordDetails[0];

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
