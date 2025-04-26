const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const userAuthentication = require("../../../middleware/authentication/userAuthentication");

const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./getDetails");
const listSchema = require("./list");

// SERVICES
const save = require("../../../services/sampleInquiry/save");
const sampleInquiryList = require("../../../services/sampleInquiry/list");
const getDetails = require("../../../services/sampleInquiry/getDetails");
const update = require("../../../services/sampleInquiry/update");
const deleteSampleInquiry = require("../../../services/sampleInquiry/delete");

router.post(
  "/add",
  userAuthentication,
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: true,
    schemaValidate: saveSchema,
  })
);

router.post(
  "/list",
  userAuthentication,
  commonResolver.bind({
    modelService: sampleInquiryList,
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
  userAuthentication,
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.post(
  "/delete",
  userAuthentication,
  commonResolver.bind({
    modelService: deleteSampleInquiry,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
