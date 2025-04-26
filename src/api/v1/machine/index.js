const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");

const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const listSchema = require("./list");
const updateSchema = require("./update");
const deleteSchema = require("./delete");

const detailSchema = require("./details");

// SERVICES
const saveMachine = require("../../../services/machine/save");
const machineList = require("../../../services/machine/list");
const updateMachine = require("../../../services/machine/update");
const deleteMachine = require("../../../services/machine/delete");
const machineDetails = require("../../../services/machine/details");

router.post(
  "/add-machine",
  commonResolver.bind({
    modelService: saveMachine,
    isRequestValidateRequired: true,
    schemaValidate: saveSchema,
  })
);

router.post(
  "/machine-list",
  commonResolver.bind({
    modelService: machineList,
    isRequestValidateRequired: true,
    schemaValidate: listSchema,
  })
);

router.post(
  "/update-machine",
  commonResolver.bind({
    modelService: updateMachine,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.post(
  "/delete-machine",
  commonResolver.bind({
    modelService: deleteMachine,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

router.post(
  "/machine-details",
  commonResolver.bind({
    modelService: machineDetails,
    isRequestValidateRequired: true,
    schemaValidate: detailSchema,
  })
);

module.exports = router;
