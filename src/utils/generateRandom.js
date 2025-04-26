const bwipjs = require("bwip-js");
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../../public/image/barcodeImage");

const generateRandom = (length = 32, alphanumeric = true) => {
  let data = "",
    keys = "";

  if (alphanumeric) {
    keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else {
    keys = "0123456789";
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};

const generateCustomRandomNumber = (max = 50, min = 0) => {
  let data = Math.floor(Math.random() * (max - min + 1) + min);

  return data;
};

const generateAmountFormat = (amount, isNoSymbol = false) => {
  let data;
  if (isNoSymbol) {
    data = amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    data = amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return data;
};

const generateNumberFormat = (number, roundOff = false) => {
  let totalNumberFix = number.toFixed(2);
  let data;
  if (roundOff) {
    data = (number - parseInt(totalNumberFix)).toFixed(2);
  } else {
    data = totalNumberFix;
  }

  return data;
};

const generateBarcode = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
};

const generateBarImage = (barCodeNumber) => {
  // Ensure the upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: barCodeNumber,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
        textfont: "/mnt/data/c39hrp24dhtt.ttf", // Use your uploaded font
        textsize: 12, // Adjust text size
      },
      (err, png) => {
        if (err) {
          console.error("Error generating barcode:", err);
          reject(err);
        } else {
          const fileName = `barcode-${barCodeNumber}.png`;
          const filePath = path.join(UPLOAD_DIR, fileName);
          fs.writeFileSync(filePath, png);
          let barcodeImgPath = "image/barcodeImage/" + fileName;
          resolve(barcodeImgPath);
        }
      }
    );
  });
};

const formatDateString = (dateStr) => {
  const [day, month, year] = dateStr.split("-");

  return `${year}-${month}-${day}`;
};

module.exports = {
  generateRandom,
  generateCustomRandomNumber,
  generateAmountFormat,
  generateNumberFormat,
  generateBarcode,
  generateBarImage,
  formatDateString,
};
