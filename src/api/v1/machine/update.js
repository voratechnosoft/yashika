const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vMachineId: Joi.string().required().label("vMachineId").trim(),
  vMachinName: Joi.string().required().label("Machin Name").trim(),
  iCalculateStitch: Joi.number().required().label("Calculate Stitch"),
  iMachineStatus: Joi.number().label("iMachineStatus").default(1),
});

module.exports = saveSchema;
