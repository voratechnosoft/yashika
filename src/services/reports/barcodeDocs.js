const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const fetch = require("node-fetch");
const { Document, Packer, Paragraph, ImageRun } = require("docx");
const path = require("path");
const moment = require("moment");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const BASE_URL = process.env.NODE_URL;

let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY");
let fileName = "barcode-" + reportGenerateDate + ".docx";
const outputFolder = path.join(
  __dirname,
  "../../../public",
  "docx",
  "barcodeDocx"
);
const outputFile = path.join(outputFolder, fileName);

// Ensure folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const barcodeDocs = async (req, res) => {
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

    const data = await barcodeList();

    let recordList = data.data;

    if (recordList.length === 0) {
      return res.status(200).json({
        message: "No Data Found",
      });
    }

    // Initialize Document properly
    const doc = new Document({
      sections: [],
      creator: "Yashika Barcode Generator",
      title: "Barcode List",
    });

    const barcodeSections = [];

    for (const record of recordList) {
      const imagePath = record.vBarcodeImage;
      const barcodeId = record.vBarcodeId || "Unknown";
      const imageUrl = BASE_URL + imagePath;

      try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();

        barcodeSections.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 240,
                  height: 80,
                },
              }),
            ],
          }),
          // new Paragraph(barcodeId),
          new Paragraph("") // Spacer
        );
      } catch (imgErr) {
        console.warn(`Could not fetch image for ${barcodeId}:`, imgErr.message);
      }
    }

    doc.addSection({
      children: barcodeSections,
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputFile, buffer);

    // const fileStream = fs.createReadStream(outputFile);
    // fileStream.pipe(res);

    // res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    // res.setHeader(
    //   "Content-Type",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // );

    return res.status(200).json({
      message: "Success",
      filePath: `docx/barcodeDocx/${fileName}`,
    });
  } catch (error) {
    console.error("barcodeDocsError ----------->", error);
    throw new Error(error?.message);
  }
};

const barcodeList = async () => {
  try {
    let filter = {
      isDeleted: false,
    };

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

module.exports = barcodeDocs;
