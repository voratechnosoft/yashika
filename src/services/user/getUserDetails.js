const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getUserDetails = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = payload;

    let filterCondition = {
      _id: new ObjectId(userId),
      isDeleted: false,
      // isAdmin: false,
    };

    let userData = await dbService.findOneRecord("UserModel", filterCondition, {
      _id: 1,
    });
    if (!userData) throw new Error(Message.recordNotFound);

    let aggregateQuery = [
      {
        $match: filterCondition,
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
          arrUserAccess: 1,
          vProfileImage: 1,
          vDeviceToken: 1,
          vUserRoleId: 1,
          vUserRoleName: "$roleData.vName",
          isBlock: 1,
          isActive: 1,
          isDeleted: 1,
          isAdmin: 1,
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
    console.error("getUserDetailsError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = getUserDetails;
