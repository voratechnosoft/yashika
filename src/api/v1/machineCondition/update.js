const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vMachineConditionId: Joi.string().required().label("Machine Condition Id"),
  vMachineName: Joi.string().required().label("Machine Name").trim(),
  iMachineNumber: Joi.number().required().label("Machine Number"),
  iMachineStatus: Joi.number().label("Machine Status").default(1),
});

module.exports = updateSchema;
