const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vGroupId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vGroupId),
    };

    let groupData = await dbService.findOneRecord("GroupModel", filter, {
      _id: 1,
    });
    if (!groupData) throw new Error(Message.recordNotFound);

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblusers",
          let: { userIds: "$arrUserId" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$userIds"] }, // Match if _id is in arrUserId
              },
            },
            {
              $project: {
                _id: 1,
                vName: 1,
                vMobile: 1,
                arrUserAccess: 1,
                vProfileImage: 1,
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $project: {
          _id: 1,
          vGroupName: 1,
          arrUserId: 1,
          vGroupImage: 1,
          userData: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let getRecordDetails = await dbService.aggregateData(
      "GroupModel",
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
