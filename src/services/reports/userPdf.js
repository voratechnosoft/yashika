const ObjectId = require("mongodb").ObjectId;
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");

const userPdf = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = req;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("report")) {
      throw new Error(Message.reportNotPermission);
    }

    let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH-mm-ss");
    let fileName = "userReport-" + reportGenerateDate + ".xlsx";
    const xlsxFilePath = path.join(
      __dirname,
      "../../../public",
      "xlsx",
      "userReport",
      fileName
    );

    const isExcelCreated = await createExcelFile(xlsxFilePath);

    if (!isExcelCreated) {
      return res.status(200).json({
        message: "No Data Found",
      });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Stream the file to avoid memory issues
    fs.createReadStream(xlsxFilePath).pipe(res);

    return res.status(200).json({
      message: "Success",
      filePath: `xlsx/userReport/${fileName}`,
    });
  } catch (error) {
    console.error("userPdf Error ----------->", error);
    throw new Error(error?.message);
  }
};

// Function to create the Excel file
async function createExcelFile(filePath) {
  const reportName = "User With Details";

  const data = await userDetailsList();
  let userDetails = data?.data;

  if (userDetails?.userData?.length === 0) {
    return false;
  }

  const reportDate = moment(new Date()).format("DD-MM-YYYY");

  let totalCount = userDetails?.totalCount ? userDetails?.totalCount : 0;
  let totalAdmin = userDetails?.totalAdmin ? userDetails?.totalAdmin : 0;
  let totalSubAdmin = userDetails?.totalSubAdmin
    ? userDetails?.totalSubAdmin
    : 0;
  let totalUser = userDetails?.totalUser ? userDetails?.totalUser : 0;
  let totalActive = userDetails?.totalActive ? userDetails?.totalActive : 0;
  let totalInActive = userDetails?.totalInActive
    ? userDetails?.totalInActive
    : 0;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Daily Update");

  const headerStyle = {
    font: { bold: false, color: { argb: "000000" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  worksheet.mergeCells("B3:G3");
  const reportCell = worksheet.getCell("B3");
  reportCell.value = `Report Name : ${reportName}`;
  reportCell.font = { bold: true, size: 14 };
  reportCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  reportCell.alignment = { horizontal: "center", vertical: "middle" };
  reportCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  worksheet.getCell("B4").value = `Report Date : ${reportDate}`;
  worksheet.getCell("B6").value = `Total(All) : ${totalCount}`;
  worksheet.getCell("D6").value = `Admin : ${totalAdmin}`;
  worksheet.getCell("B7").value = `Sub Admin : ${totalSubAdmin}`;
  worksheet.getCell("D7").value = `User : ${totalUser}`;
  worksheet.getCell("B8").value = `Active : ${totalActive}`;
  worksheet.getCell("D8").value = `In Active : ${totalInActive}`;

  // 📌 Column Headers
  const columns = ["Date", "Person Name", "Mobile No", "Role", "Status"];

  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(columns).eachCell((cell) => {
    cell.style = headerStyle;
  });

  userDetails?.userData.forEach((item) => {
    let createdDate = item?.dtCreatedAt
      ? moment(item?.dtCreatedAt).format("DD-MM-YYYY")
      : "-----";
    let userName = item?.vName ? item?.vName : "-----";
    let mobileNumber = item?.vMobile ? item?.vMobile : "-----";
    let role = item?.vUserRoleName ? item?.vUserRoleName : "-----";
    let status = item?.isBlock ? "Block" : "Active";

    worksheet.addRow([createdDate, userName, mobileNumber, role, status]);
  });

  worksheet.addRow([]); // Empty row

  await workbook.xlsx.writeFile(filePath);
  return true; // File written successfully
}

const userDetailsList = async () => {
  try {
    let filter = {
      isDeleted: false,
    };

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
          isAdmin: 1,
          isBlock: 1,
          isActive: 1,
          isDeleted: 1,
          dtCreatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
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
    console.error("userDetailsList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = userPdf;
