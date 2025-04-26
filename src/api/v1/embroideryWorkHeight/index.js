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
const save = require("../../../services/embroideryWorkHeight/save");
const list = require("../../../services/embroideryWorkHeight/list");
const getDetails = require("../../../services/embroideryWorkHeight/getDetails");
const update = require("../../../services/embroideryWorkHeight/update");
const deleteDetails = require("../../../services/embroideryWorkHeight/delete");

router.post(
  "/add",
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
