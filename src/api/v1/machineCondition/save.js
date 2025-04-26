const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vMachineName: Joi.string().required().label("Machine Name").trim(),
  iMachineNumber: Joi.number().required().label("Machine Number"),
  iMachineStatus: Joi.number().label("Machine Status").default(1),
});

module.exports = saveSchema;
