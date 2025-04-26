const ObjectId = require("mongodb").ObjectId;
const pdf = require("html-pdf");
const path = require("path");
const moment = require("moment");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const generateHtmlContent = (data) => {
  // const startIndex = pageIndex * recordsPerPage;
  // const endIndex = Math.min(startIndex + recordsPerPage, data.length);
  // const pageData = data.slice(startIndex, endIndex);

  let baseUrl = "https://voratechnosoft.com";
  let liveUrl = process.env.NODE_URL;

  // HTML template for each page
  let htmlInvoiceTemplate = "<!DOCTYPE html><html lang='en-US'>";

  htmlInvoiceTemplate +=
    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0' /><title>Yashika Barcode</title>";

  htmlInvoiceTemplate +=
    "<style>@font-face {font-family: Gilroy-Bold; src: url('" +
    baseUrl +
    "/fonts/Gilroy-Bold.ttf');} body {font-family: Gilroy-Bold, sans-serif; background: #fff; text-align: center; margin: 0; padding: 10mm;} .barcode-wrapper { display: flex;justify-content: center;align-items: center;margin-bottom: 10mm;page-break-inside: avoid;} img { width: 340px; height: auto;} </style></head><body>";

  // htmlInvoiceTemplate += "<table class='bb'><tbody class='tr-bg'>";

  // Loop over the data for the current page
  data.forEach((record) => {
    let bar_image = record?.vBarcodeImage;
    let barcode_image = bar_image ? liveUrl + bar_image : "";

    htmlInvoiceTemplate +=
      "<div class='barcode-wrapper'><img src='" +
      barcode_image +
      "' alt='barcode' /></div>";
  });

  htmlInvoiceTemplate += "</body></html>";

  return htmlInvoiceTemplate;
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

    const recordsPerPage = 10;
    // const totalPages = Math.ceil(recordList.length / recordsPerPage);

    // let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH:mm:ss");
    // let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY");
    let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH-mm-ss");
    let parts = reportGenerateDate.split("-");
    let formatted = `${parts[0]}${parts[1]}${parts[2]}_${parts[3]}${parts[4]}${parts[5]}`;
    // let fileName = "barcodePdf-" + reportGenerateDate + ".pdf";

    let fileName = "barcodePdf_" + formatted + ".pdf";

    const pdfFilePath = path.join(
      __dirname,
      "../../../public",
      "pdf",
      "barcodePdf",
      fileName
    );

    // Set options for the PDF generation
    // const options = {
    //   format: "A4", // You can choose other formats like 'A4', 'Legal', etc.
    // };

    const options = {
      // width: "75mm", // Custom width
      // height: "30mm", // Custom height
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      timeout: 60000,
      // border: {
      //   top: "2mm",
      //   right: "2mm",
      //   bottom: "2mm",
      //   left: "2mm",
      // },
    };

    let allPagesHtml = generateHtmlContent(recordList);
    // for (let i = 0; i < recordList.length; i++) {
    //   allPagesHtml += generateHtmlContent(
    //     recordList,
    //     i,
    //     recordsPerPage
    //   );
    // }

    pdf.create(allPagesHtml, options).toFile(pdfFilePath, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Fail" });
      }

      return res.status(200).json({
        message: "Success",
        fileName: "pdf/barcodePdf/" + fileName,
      });
    });
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
