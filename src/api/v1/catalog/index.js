const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const multer = require("multer");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./details");
const getBarcodeWiseDetailsSchema = require("./getBarcodeWiseDetails");
const listSchema = require("./list");

// SERVICES
const save = require("../../../services/catalog/save");
const list = require("../../../services/catalog/list");
const getDetails = require("../../../services/catalog/getDetails");
const getBarcodeWiseDetails = require("../../../services/catalog/getBarcodeWiseDetails");
const update = require("../../../services/catalog/update");
const deleteDetails = require("../../../services/catalog/delete");

// Upload Image
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image/catalog");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "catalog-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const imageUpload = multer({ storage: storage });

router.post(
  "/add",
  imageUpload.array("arrProductImage", 10),
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: false,
    schemaValidate: saveSchema,
  })
);

router.post(
  "/list",
  commonResolver.bind({
    modelService: list,
    isRequestValidateRequired: true,
    schemaValidate: listSchema,
  })
);

router.post(
  "/getDetails",
  commonResolver.bind({
    modelService: getDetails,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.post(
  "/getBarcodeWiseDetails",
  commonResolver.bind({
    modelService: getBarcodeWiseDetails,
    isRequestValidateRequired: true,
    schemaValidate: getBarcodeWiseDetailsSchema,
  })
);

router.post(
  "/update",
  imageUpload.array("arrProductImage", 10),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: false,
    schemaValidate: updateSchema,
  })
);

router.post(
  "/delete",
  commonResolver.bind({
    modelService: deleteDetails,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
