const ObjectId = require("mongodb").ObjectId;
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");
const path = require("path");
const moment = require("moment");
const axios = require("axios");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getBase64FromUrl = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error(`Image download failed: ${url}`);
    return ""; // Return empty to avoid breaking layout
  }
};

const generateHtmlContent = async (data) => {
  const liveUrl = process.env.NODE_URL || "http://159.65.149.67:3000/";

  // HTML template for each page
  let htmlTemplate = "<!DOCTYPE html><html lang='en-US'>";

  htmlTemplate +=
    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0' /><title>Yashika Barcode</title>";

  htmlTemplate +=
    "<style> body {font-family: Arial, sans-serif; background: #fff; text-align: center; margin: 0; padding: 10mm;} .barcode-wrapper { display: flex;justify-content: center;align-items: center;margin-bottom: 10mm;page-break-inside: avoid;} img { width: 340px; height: auto;} </style></head><body>";

  // Loop over the data for the current page
  // data.forEach((record) => {
  //   let imageUrl = record?.vBarcodeImage ? liveUrl + record?.vBarcodeImage : "";

  //   htmlTemplate +=
  //     "<div class='barcode-wrapper'><img src='" +
  //     imageUrl +
  //     "' alt='barcode' /></div>";
  // });

  for (let record of data) {
    let imageUrl = record?.vBarcodeImage ? liveUrl + record?.vBarcodeImage : "";
    let base64Image = await getBase64FromUrl(imageUrl);

    htmlTemplate +=
      "<div class='barcode-wrapper'><img src='" +
      base64Image +
      "' alt='barcode' /></div>";
  }

  htmlTemplate += "</body></html>";

  return htmlTemplate;
};

// Puppeteer-based PDF generation
const generatePdfWithPuppeteer = async (htmlContent, outputPath) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-first-run",
      "--safebrowsing-disable-auto-update",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent("Mozilla/5.0");

  await page.setContent(htmlContent, {
    // waitUntil: "domcontentloaded",
    waitUntil: "networkidle0",
    // waitUntil: "waitForTimeout",
    timeout: 60000, // 60 seconds
  });

  // await page.waitForTimeout(3000);
  await new Promise((resolve) => setTimeout(resolve, 12000));

  await page.pdf({
    path: outputPath,
    format: "A4",
    // orientation: "portrait",
    printBackground: true,
    // timeout: 60000,
    margin: {
      top: "10mm",
      right: "10mm",
      bottom: "10mm",
      left: "10mm",
    },
  });

  await browser.close();
};

const barcodePdf = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: { arrDesignNumber = [] },
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

    const data = await barcodeList(arrDesignNumber);

    let recordList = data.data;

    if (recordList.length === 0) {
      return res.status(200).json({
        message: "No Data Found",
      });
    }

    let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH-mm-ss");
    let parts = reportGenerateDate.split("-");
    let formatted = `${parts[0]}${parts[1]}${parts[2]}_${parts[3]}${parts[4]}${parts[5]}`;

    let fileName = "barcodePdf_" + formatted + ".pdf";

    const pdfFilePath = path.join(
      __dirname,
      "../../../public",
      "pdf",
      "barcodePdf",
      fileName
    );

    const htmlContent = await generateHtmlContent(recordList);

    await generatePdfWithPuppeteer(htmlContent, pdfFilePath);

    return res.status(200).json({
      message: "Success",
      fileName: "pdf/barcodePdf/" + fileName,
    });

    // const options = {
    //   format: "A4",
    //   orientation: "portrait",
    //   border: "10mm",
    //   timeout: 60000,
    // };

    // let allPagesHtml = generateHtmlContent(recordList);

    // pdf.create(allPagesHtml, options).toFile(pdfFilePath, (err, result) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(401).json({ message: "Fail" });
    //   }

    //   return res.status(200).json({
    //     message: "Success",
    //     fileName: "pdf/barcodePdf/" + fileName,
    //   });
    // });
  } catch (error) {
    console.error("barcodePdfError ----------->", error);
    throw new Error(error?.message);
  }
};

const barcodeList = async (arrDesignNumber) => {
  try {
    let filter = {
      isDeleted: false,
    };

    if (Array.isArray(arrDesignNumber) && arrDesignNumber.length > 0) {
      filter.vDesignNumber = { $in: arrDesignNumber.map((number) => number) };
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vBarcodeId: 1,
          vBarcodeImage: 1,
          isDeleted: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "CatalogModel",
      aggregateQuery
    );

    return { data: dataList };
  } catch (error) {
    console.error("barcodeList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = barcodePdf;
