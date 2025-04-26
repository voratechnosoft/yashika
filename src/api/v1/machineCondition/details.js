const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vMachineConditionId: Joi.string().required().label("Machine Condition Id"),
});

module.exports = getDetailSchema;
