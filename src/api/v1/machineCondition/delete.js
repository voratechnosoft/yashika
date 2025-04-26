const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vMachineConditionId: Joi.string().required().label("Machine Condition Id"),
});
module.exports = deleteSchema;
