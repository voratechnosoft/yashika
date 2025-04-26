const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vPlainMeterId: Joi.string().required().label("Plain Meter Id"),
});
module.exports = deleteSchema;
