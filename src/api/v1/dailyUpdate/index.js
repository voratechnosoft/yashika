const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const multer = require("multer");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./details");
const listSchema = require("./list");

// SERVICES
const save = require("../../../services/dailyUpdate/save");
const list = require("../../../services/dailyUpdate/list");
const getDetails = require("../../../services/dailyUpdate/getDetails");
const update = require("../../../services/dailyUpdate/update");
const deleteDetails = require("../../../services/dailyUpdate/delete");

// Upload Recording
let recordingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/recording");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "recording-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const recordingUpload = multer({ storage: recordingStorage });

router.post(
  "/add",
  recordingUpload.single("vRecording"),
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: true,
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
  "/update",
  recordingUpload.single("vRecording"),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
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
