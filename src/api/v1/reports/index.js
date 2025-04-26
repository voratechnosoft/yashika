const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const router = new Router();

const reportsSchema = require("./machineReports");

// SERVICES
const barcodePdf = require("../../../services/reports/barcodePdf");
const barcodeDocs = require("../../../services/reports/barcodeDocs");
const userPdf = require("../../../services/reports/userPdf");
const dailyUpdateXL = require("../../../services/reports/dailyUpdateXL");
const catalogDetailsXL = require("../../../services/reports/catalogDetailsXL");
const userInquiryExcel = require("../../../services/reports/userInquiryExcel");

router.post("/barcodePdf", barcodePdf);
router.post("/barcodeDocs", barcodeDocs);
router.post("/userPdf", userPdf);
router.post("/userInquiryExcel", userInquiryExcel);
router.post("/dailyUpdateXL", dailyUpdateXL);
router.post("/catalogDetailsXL", catalogDetailsXL);

module.exports = router;
