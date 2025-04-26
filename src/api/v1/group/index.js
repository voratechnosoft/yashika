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
const save = require("../../../services/group/save");
const list = require("../../../services/group/list");
const getDetails = require("../../../services/group/getDetails");
const update = require("../../../services/group/update");
const deleteDetails = require("../../../services/group/delete");

// Upload Image
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image/group");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "group-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const imageUpload = multer({ storage: storage });

router.post(
  "/add",
  imageUpload.single("vGroupImage"),
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: false,
    schemaValidate: saveSchema,
  })
);

router.get(
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
  imageUpload.single("vGroupImage"),
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
