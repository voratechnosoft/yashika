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

const catalogDetailsXL = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vDesignNumber = "", dtStart = "", dtEnd = "" },
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
    let fileName = "catalogReport-" + reportGenerateDate + ".xlsx";
    const xlsxFilePath = path.join(
      __dirname,
      "../../../public",
      "xlsx",
      "catalogReport",
      fileName
    );

    await createExcelFile(xlsxFilePath, vDesignNumber, dtStart, dtEnd);

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
      filePath: `xlsx/catalogReport/${fileName}`,
    });
  } catch (error) {
    console.error("catalogDetailsXL Error ----------->", error);
    throw new Error(error?.message);
  }
};

// Function to create the Excel file
async function createExcelFile(filePath, vDesignNumber, dtStart, dtEnd) {
  const reportName = "Catalog With Details";

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

  const catalogData = await catalogDetailsList(vDesignNumber, dtStart, dtEnd);

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

  let design_number = vDesignNumber ? vDesignNumber : "All";

  worksheet.getCell("G4").value = `Design No : ${design_number}`;
  // worksheet.getCell("G5").value = "Worker Name : All";

  // 📌 Column Headers
  const columns = [
    "Product Img",
    "Design No",
    "Category",
    "Fabric Quality",
    "Fabric Color",
    "Other Color",
    "Fabric Panna",
    "F. Work Height",
    "Farma Rate",
    "Farma Rate With Stone",
    "less border",
    "less border with Stone",
    "Meter rate",
    "Fabric Included(M)",
    "Plain Fabric Rate",
    // "Barcode",
  ];

  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(columns).eachCell((cell) => {
    cell.style = headerStyle;
  });

  catalogData.forEach((item) => {
    worksheet.addRow([
      "",
      item?.vDesignNumber ? item?.vDesignNumber : "",
      item?.vCategoryName ? item?.vCategoryName : "",
      item?.vFabricName ? item?.vFabricName : "",
      item?.vFabricColor ? item?.vFabricColor : "",
      item?.vOtherColor ? item?.vOtherColor : "",
      item?.vFabricPannaName ? item?.vFabricPannaName : "",
      item?.vEmbroideryWorkName ? item?.vEmbroideryWorkName : "",
      item?.vFarmaRate ? item?.vFarmaRate : "",
      item?.vFarmaRateWithStoan ? item?.vFarmaRateWithStoan : "",
      item?.vLessBorder ? item?.vLessBorder : "",
      item?.vLessBorderWithStoan ? item?.vLessBorderWithStoan : "",
      item?.vFabricPlainMeter ? item?.vFabricPlainMeter : "",
      item?.vPlainMeter ? item?.vPlainMeter : "",
      item?.iPlainFabricRate ? item?.iPlainFabricRate : "",
    ]);

    if (item.arrProductImage?.length > 0) {
      const imageFile = item.arrProductImage[0].replace(/\\/g, "/");
      const imagePath = path.resolve(__dirname, "../../../public", imageFile);

      if (fs.existsSync(imagePath)) {
        const imageExt = path.extname(imageFile).replace(".", ""); // Get extension without dot
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: imageExt || "jpeg",
        });

        const rowNumber = worksheet.rowCount;

        worksheet.addImage(imageId, {
          tl: { col: 0, row: rowNumber - 1 },
          br: { col: 1, row: rowNumber },
          // editAs: "oneCell",
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

const catalogDetailsList = async (vDesignNumber, dtStart, dtEnd) => {
  try {
    let filter = {
      isDeleted: false,
    };

    if (vDesignNumber) {
      filter["vDesignNumber"] = vDesignNumber;
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
          from: "tblgroups",
          localField: "vGroupId",
          foreignField: "_id",
          as: "groupData",
        },
      },
      {
        $unwind: {
          path: "$groupData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfusions",
          localField: "vFusionId",
          foreignField: "_id",
          as: "fusionData",
        },
      },
      {
        $unwind: {
          path: "$fusionData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabricpannas",
          localField: "vFabricPannaId",
          foreignField: "_id",
          as: "fabricPannaData",
        },
      },
      {
        $unwind: {
          path: "$fabricPannaData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabricplainincludeds",
          localField: "vFabricPlainIncludedId",
          foreignField: "_id",
          as: "fabricPlainIncludedData",
        },
      },
      {
        $unwind: {
          path: "$fabricPlainIncludedData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblembroideryworkheights",
          localField: "vEmbroideryWorkHeightId",
          foreignField: "_id",
          as: "embroideryWorkHeightData",
        },
      },
      {
        $unwind: {
          path: "$embroideryWorkHeightData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblplainmeters",
          localField: "vPlainMeterId",
          foreignField: "_id",
          as: "plainMeterData",
        },
      },
      {
        $unwind: {
          path: "$plainMeterData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblfabrics",
          localField: "vFabricId",
          foreignField: "_id",
          as: "fabricData",
        },
      },
      {
        $unwind: {
          path: "$fabricData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblcategories",
          localField: "vCategoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          iFrameNumber: 1,
          iPlainFabricRate: 1,
          iFabricSale: 1,
          iProductStatus: 1,
          arrProductImage: 1,
          vBarcodeId: 1,
          vBarcodeImage: 1,
          vDesignNumber: 1,
          arrFavorites: 1,
          vFabricId: 1,
          vFabricName: "$fabricData.vFabricQuality",
          vCategoryId: 1,
          vCategoryName: "$categoryData.vName",
          vFusionId: 1,
          vFusionName: "$fusionData.vName",
          vFabricPannaId: 1,
          vFabricPannaName: "$fabricPannaData.vName",
          vFabricPlainIncludedId: 1,
          vFabricPlainIncludedName: "$fabricPlainIncludedData.vName",
          vPlainMeter: 1,
          vPlainMeterId: 1,
          vPlainMeterName: "$plainMeterData.vName",
          vEmbroideryWorkHeightId: 1,
          vEmbroideryWorkName: "$embroideryWorkHeightData.vName",
          vGroupId: 1,
          vGroupName: "$groupData.vGroupName",
          vFabricColor: 1,
          vOtherColor: 1,
          vFarmaRate: 1,
          vFarmaRateWithStoan: 1,
          vLessBorder: 1,
          vLessBorderWithStoan: 1,
          vFabricPlainMeter: 1,
          isDeleted: 1,
          vCreatedBy: 1,
          vUpdatedBy: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "CatalogModel",
      aggregateQuery
    );

    return dataList;
  } catch (error) {
    console.error("catalogDetailsList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = catalogDetailsXL;
