const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getUserDetails = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vUserId },
    } = entry;

    let filter = {
      _id: new ObjectId(vUserId),
      vCreatedBy: new ObjectId(userId),
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
    });
    if (!userData) throw new Error(Message.recordNotFound);

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblroles",
          localField: "vUserRoleId",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: {
          path: "$roleData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vMobile: 1,
          vUserRoleId: 1,
          vUserRoleName: "$roleData.vName",
          arrUserAccess: 1,
          vProfileImage: 1,
          isBlock: 1,
          isActive: 1,
          isDeleted: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData("UserModel", aggregateQuery);
    if (!dataList) throw new Error(Message.systemError);

    let result = {};
    if (dataList?.length > 0) {
      result = dataList[0];
    }

    return result;
  } catch (error) {
    console.error("getUserDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getUserDetails;
