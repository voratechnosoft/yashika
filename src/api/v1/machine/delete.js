const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vMachineId: Joi.string().required().label("vMachineId").trim(),
});

module.exports = deleteSchema;
