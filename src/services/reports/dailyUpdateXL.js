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

const dailyUpdateXL = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: { vMachinId = "", dtStart = "", dtEnd = "" },
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
    let parts = reportGenerateDate.split("-");
    let formatted = `${parts[0]}${parts[1]}${parts[2]}_${parts[3]}${parts[4]}${parts[5]}`;

    let machinNameText;
    if (vMachinId) {
      let machinData = await dbService.findOneRecord("MachineModel", {
        _id: new ObjectId(vMachinId),
      });

      machinNameText = machinData?.vMachinName;
    } else {
      machinNameText = "All";
    }

    let fileName =
      "MachineDailyUpdate_" + machinNameText + "_" + formatted + ".xlsx";
    const xlsxFilePath = path.join(
      __dirname,
      "../../../public",
      "xlsx",
      "machineDailyReport",
      fileName
    );

    await createExcelFile(xlsxFilePath, vMachinId, dtStart, dtEnd);

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
      filePath: `xlsx/machineDailyReport/${fileName}`,
    });
  } catch (error) {
    console.error("dailyUpdateXL Error ----------->", error);
    throw new Error(error?.message);
  }
};

// Function to create the Excel file
async function createExcelFile(filePath, vMachinId, dtStart, dtEnd) {
  const reportName = "Machine Daily Update";

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

  const dailyData = await dailyUpdateList(vMachinId, dtStart, dtEnd);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Daily Update");

  const headerStyle = {
    font: { bold: true, color: { argb: "000000" } },
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

  let machinName = vMachinId ? dailyData[0]?.machinName : "All";
  let workerName = vMachinId ? dailyData[0]?.workerName : "All";
  let workingTime = vMachinId ? dailyData[0]?.vWorkingTime : "All";
  let machineCondition = vMachinId ? dailyData[0]?.vMachineCondition : "All";

  worksheet.getCell("G4").value = `Machine No : ${machinName}`;
  worksheet.getCell("G5").value = `Worker Name : ${workerName}`;
  worksheet.getCell("G6").value = `Working Time : ${workingTime}`;
  worksheet.getCell("G7").value = `Machine Condition : ${machineCondition}`;

  // 📌 Column Headers
  const columns = [
    "Date",
    "Machine No",
    "Worker Name",
    "Working Time",
    "Working Day",
    "Machine Condition",
    "Notes",
    "Recording",
    "Stop Time (hrs)",
    "Thread Break",
    "Frame",
    "Default Current Stitch",
    "Current Stitch",
    "Running Stitch",
    "Stitch Commission",
  ];

  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(columns).eachCell((cell) => {
    cell.style = headerStyle;
  });

  const rowData = dailyData.map((item) => [
    item?.vDate
      ? moment(item?.vDate).format("DD-MM-YYYY")
      : moment(item?.dtCreatedAt).format("DD-MM-YYYY"),
    item?.machinName,
    item?.workerName,
    item?.vWorkingTime,
    item?.vWorkingDay,
    item?.vMachineCondition,
    item?.vDescription,
    item?.vRecording,
    item?.iStopTimeHours + "." + item?.iStopTimeMinute,
    item?.iThreadBreak,
    item?.iFrame,
    item?.iCalculateOldStitch,
    item?.iCurrentStitch,
    item?.iRunningStitch,
    item?.bonusValue,
  ]);

  rowData.forEach((row) => worksheet.addRow(row));

  // Calculate totals
  const totalThreadBreak = dailyData.reduce(
    (sum, item) => sum + (parseInt(item.iThreadBreak) || 0),
    0
  );
  const totalFrame = dailyData.reduce(
    (sum, item) => sum + (parseInt(item.iFrame) || 0),
    0
  );
  const totalCurrentStitch = dailyData.reduce(
    (sum, item) => sum + (parseInt(item.iCurrentStitch) || 0),
    0
  );
  const totalCurrentOldStitch = dailyData.reduce(
    (sum, item) => sum + (parseInt(item.iCalculateOldStitch) || 0),
    0
  );
  const totalStitchCommission = dailyData.reduce(
    (sum, item) => sum + (parseInt(item.bonusValue) || 0),
    0
  );

  worksheet.addRow([]); // Empty row
  worksheet.addRow([]); // Empty row
  const footerRow = worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    totalThreadBreak,
    totalFrame,
    totalCurrentOldStitch,
    totalCurrentStitch,
    "",
    totalStitchCommission,
  ]);
  footerRow.eachCell((cell) => (cell.style = headerStyle));

  await workbook.xlsx.writeFile(filePath);
}

const dailyUpdateList = async (vMachinId, dtStart, dtEnd) => {
  try {
    let filter = {
      isDeleted: false,
    };

    if (vMachinId) {
      filter["vMachinId"] = new ObjectId(vMachinId);
    }

    if (dtStart || dtEnd) {
      filter.vDate = {};

      if (dtStart) {
        const startDateFormatted = formatDateString(dtStart);
        let newStartDate = new Date(startDateFormatted + "T00:00:00.000Z");
        filter.vDate.$gte = newStartDate.getTime();
      }

      if (dtEnd) {
        const endDateFormatted = formatDateString(dtEnd);
        let newEndDate = new Date(endDateFormatted + "T23:59:59.000Z");
        filter.vDate.$lte = newEndDate.getTime();
      }
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblmachines",
          localField: "vMachinId",
          foreignField: "_id",
          as: "machinData",
        },
      },
      {
        $unwind: {
          path: "$machinData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tblworkers",
          localField: "vWorkerId",
          foreignField: "_id",
          as: "workerData",
        },
      },
      {
        $unwind: {
          path: "$workerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $addFields: {
      //     bonusValue: {
      //       $cond: {
      //         if: {
      //           $gt: ["$iCurrentStitch", "$machinData.iCalculateOldStitch"],
      //         }, // Check if iCurrentStitch > calculateStitch
      //         then: {
      //           $divide: [
      //             {
      //               $subtract: [
      //                 "$iCurrentStitch",
      //                 "$machinData.iCalculateOldStitch",
      //               ],
      //             },
      //             1000,
      //           ],
      //         },
      //         else: 0, // If not greater, set to 0
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 1,
          vMachinId: 1,
          machinName: "$machinData.vMachinName",
          calculateStitch: "$iMachineCalculateStitch",
          iCalculateOldStitch: "$iMachineCalculateStitch",
          vWorkerId: 1,
          workerName: "$workerData.vWorkerName",
          vWorkingTime: 1,
          vWorkingDay: 1,
          vMachineCondition: 1,
          vDescription: 1,
          vRecording: 1,
          iFrame: 1,
          iThreadBreak: 1,
          iCurrentStitch: 1,
          iRunningStitch: 1,
          iDesignNumber: 1,
          iStopTimeHours: 1,
          iStopTimeMinute: 1,
          vDate: 1,
          isDeleted: 1,
          dtUpdate: 1,
          dtCreatedAt: 1, // Include dtCreatedAt
          bonusValue: "$iCalculateOldStitch",
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "DailyUpdateModel",
      aggregateQuery
    );

    return dataList;
  } catch (error) {
    console.error("dailyUpdateList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = dailyUpdateXL;
