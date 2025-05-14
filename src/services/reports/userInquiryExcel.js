const ObjectId = require("mongodb").ObjectId;
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");
const { formatDateString } = require("../../utils/generateRandom");
const { failAction } = require("../../utils/response");

const userInquiryExcel = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: { iInquiryStatus = "", dtStart = "", dtEnd = "" },
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
      return res.status(400).json(failAction(Message.reportNotPermission));
    }

    let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH-mm-ss");
    let fileName = "userInquiryReport-" + reportGenerateDate + ".xlsx";
    const xlsxFilePath = path.join(
      __dirname,
      "../../../public",
      "xlsx",
      "userInquiryReport",
      fileName
    );

    await createExcelFile(xlsxFilePath, iInquiryStatus, dtStart, dtEnd);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Stream the file to avoid memory issues
    const fileStream = fs.createReadStream(xlsxFilePath);
    fileStream.pipe(res);

    return res.status(200).json({
      message: "Success",
      filePath: `xlsx/userInquiryReport/${fileName}`,
    });
  } catch (error) {
    console.error("userInquiryExcel Error ----------->", error);
    throw new Error(error?.message);
  }
};

// Function to create the Excel file
async function createExcelFile(filePath, iInquiryStatus, dtStart, dtEnd) {
  const reportName = "User Inquiry Details";

  let formateStartDate;
  if (dtStart) {
    const startDateFormatted = formatDateString(dtStart);
    let newStartDate = new Date(startDateFormatted + "T00:00:00.000Z");
    formateStartDate = moment(newStartDate).format("DD-MM-YYYY");
  } else {
    formateStartDate = moment(new Date()).format("DD-MM-YYYY");
  }

  let formateEndDate;
  if (dtEnd) {
    const endDateFormatted = formatDateString(dtEnd);
    let newEndDate = new Date(endDateFormatted + "T00:00:00.000Z");
    formateEndDate = moment(newEndDate).format("DD-MM-YYYY");
  } else {
    formateEndDate = moment(new Date()).format("DD-MM-YYYY");
  }

  const reportDate = moment(new Date()).format("DD-MM-YYYY");

  const periodDate = formateStartDate + " to " + formateEndDate;

  const inquiryData = await inquiryDetailsList(iInquiryStatus, dtStart, dtEnd);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Catalog Details");

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
  worksheet.getCell("B5").value = `Period : ${periodDate}`;

  let inquiry_status_text;
  let inquiry_text_status;
  if (iInquiryStatus === constants?.INQUIRY_STATUS?.PENDING) {
    inquiry_status_text = "Pending";
    inquiry_text_status = "Pending";
  } else if (iInquiryStatus === constants?.INQUIRY_STATUS?.ACCEPT) {
    inquiry_status_text = "Accept";
    inquiry_text_status = "Accept";
  } else if (iInquiryStatus === constants?.INQUIRY_STATUS?.REJECT) {
    inquiry_status_text = "Reject";
    inquiry_text_status = "Reject";
  } else {
    inquiry_status_text = "All";
    inquiry_text_status = "-----";
  }

  worksheet.getCell("G4").value = `Inquiry Status : ${inquiry_status_text}`;

  // 📌 Column Headers
  const columns = [
    "Date",
    "Design No",
    "Product Img",
    "User Name",
    "Status",
    "Description",
    "A/R By",
    "A/R Date",
  ];

  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(columns).eachCell((cell) => {
    cell.style = headerStyle;
  });

  inquiryData.forEach((item) => {
    let createdDate = item?.dtCreatedAt
      ? moment(item?.dtCreatedAt).format("DD-MM-YYYY")
      : "-----";
    let updateARDate = item?.dtUpdatedAt
      ? moment(item?.dtUpdatedAt).format("DD-MM-YYYY")
      : "-----";

    let inquiry_text_status;
    if (item?.iInquiryStatus === constants?.INQUIRY_STATUS?.PENDING) {
      inquiry_text_status = "Pending";
    } else if (item?.iInquiryStatus === constants?.INQUIRY_STATUS?.ACCEPT) {
      inquiry_text_status = "Accept";
    } else if (item?.iInquiryStatus === constants?.INQUIRY_STATUS?.REJECT) {
      inquiry_text_status = "Reject";
    } else {
      inquiry_text_status = "-----";
    }

    worksheet.addRow([
      createdDate,
      item?.vDesignNumber ? item?.vDesignNumber : "",
      "",
      item?.vUserName ? item?.vUserName : "",
      inquiry_text_status,
      item?.vDescription ? item?.vDescription : "",
      item?.vAdminName ? item?.vAdminName : "",
      updateARDate,
    ]);

    if (item.arrCatalogImage?.length > 0) {
      const imageFile = item.arrCatalogImage[0].replace(/\\/g, "/");
      const imagePath = path.resolve(__dirname, "../../../public", imageFile);

      if (fs.existsSync(imagePath)) {
        const imageExt = path.extname(imageFile).replace(".", ""); // Get extension without dot
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: imageExt || "jpeg",
        });

        const rowNumber = worksheet.rowCount;

        worksheet.addImage(imageId, {
          tl: { col: 2, row: rowNumber - 1 },
          br: { col: 3, row: rowNumber },
        });

        worksheet.getRow(rowNumber).height = 30;
      } else {
        console.warn(`Image not found: ${imagePath}`);
      }
    }
  });

  worksheet.addRow([]); // Empty row

  await workbook.xlsx.writeFile(filePath);
}

const inquiryDetailsList = async (iInquiryStatus, dtStart, dtEnd) => {
  try {
    let filter = {
      isDeleted: false,
    };

    if (iInquiryStatus) {
      filter["iInquiryStatus"] = iInquiryStatus;
    }

    if (dtStart || dtEnd) {
      filter.dtCreatedAt = {};

      if (dtStart) {
        const startDateFormatted = formatDateString(dtStart);
        let newStartDate = new Date(startDateFormatted + "T00:00:00.000Z");
        filter.dtCreatedAt.$gte = newStartDate.getTime();
      }

      if (dtEnd) {
        const endDateFormatted = formatDateString(dtEnd);
        let newEndDate = new Date(endDateFormatted + "T23:59:59.000Z");
        filter.dtCreatedAt.$lte = newEndDate.getTime();
      }
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblusers",
          localField: "vCreatedBy",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblusers",
          localField: "vUpdatedBy",
          foreignField: "_id",
          as: "adminData",
        },
      },
      {
        $unwind: {
          path: "$adminData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblcatalogs",
          localField: "vCatalogId",
          foreignField: "_id",
          as: "catalogData",
        },
      },
      {
        $unwind: {
          path: "$catalogData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vMeter: 1,
          vColor: 1,
          vFabricQuality: 1,
          vFabricPanna: 1,
          vBorder: 1,
          vExtraPlainFabric: 1,
          vDescription: 1,
          vFusion: 1,
          iInquiryStatus: 1,
          vDate: 1,
          vReason: 1,
          vRecording: 1,
          vUserId: "$userData._id",
          vUserName: "$userData.vName",
          vUserNumber: "$userData.vMobile",
          vUserProfileImage: "$userData.vProfileImage",
          vAdminId: "$adminData._id",
          vAdminName: "$adminData.vName",
          vDesignNumber: "$catalogData.vDesignNumber",
          arrCatalogImage: "$catalogData.arrProductImage",
          vBarcodeId: "$catalogData.vBarcodeId",
          vCatalogId: 1,
          isDeleted: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "SampleInquiryModel",
      aggregateQuery
    );

    return dataList;
  } catch (error) {
    console.error("inquiryDetailsList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = userInquiryExcel;
