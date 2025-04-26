const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vMachineId: Joi.string().required().label("vMachineId").trim(),
});
module.exports = saveSchema;
