const ObjectId = require("mongodb").ObjectId;
const constants = require("../../config/constants");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const paginationFn = require("../../utils/pagination");

const userList = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: { vSearchText, vRoleId, isBlock = false, iPage = 1, iLimit = 10 },
    } = payload;

    const { docLimit, noOfDocSkip, sortBy } = paginationFn({
      iPage,
      iLimit,
    });

    let filterCondition = {
      isDeleted: false,
      isBlock: isBlock,
      _id: { $nin: [new ObjectId(userId)] },
    };

    // if (isAdmin !== "") {
    //   if (isAdmin.toLowerCase() === "user") {
    //     filterCondition["isAdmin"] = false;
    //   } else if (isAdmin.toLowerCase() === "admin") {
    //     filterCondition["isAdmin"] = true;
    //   }
    // }

    if (vSearchText) {
      var regex = new RegExp(vSearchText, "i");
      filterCondition["$or"] = [{ vName: regex }, { vMobile: regex }];
    }

    if (vRoleId !== "" && vRoleId !== undefined && vRoleId !== null) {
      filterCondition.vUserRoleId = new ObjectId(vRoleId);
    }

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
          vUserRoleId: 1,
          vUserRoleName: "$roleData.vName",
          arrUserAccess: 1,
          vProfileImage: 1,
          isAdmin: 1,
          isBlock: 1,
          isActive: 1,
          isDeleted: 1,
        },
      },
      { $sort: sortBy },
      { $skip: noOfDocSkip },
      { $limit: docLimit },
    ];

    const dataList = await dbService.aggregateData("UserModel", aggregateQuery);

    let totalCount = await dbService.recordsCount("UserModel", {
      isDeleted: false,
    });

    let totalAdmin = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: true,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.ADMIN),
    });

    let totalSubAdmin = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: true,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.SUB_ADMIN),
    });

    let totalUser = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: false,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.USER),
    });

    let totalActive = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isBlock: false,
    });

    let totalInActive = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isBlock: true,
    });

    if (!dataList) throw new Error(Message.systemError);

    let result = {
      userData: dataList,
      totalCount: totalCount,
      totalAdmin: totalAdmin,
      totalSubAdmin: totalSubAdmin,
      totalUser: totalUser,
      totalActive: totalActive,
      totalInActive: totalInActive,
    };

    return { data: result };
  } catch (error) {
    console.error("userListError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = userList;
