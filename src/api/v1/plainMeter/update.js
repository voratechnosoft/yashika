const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vPlainMeterId: Joi.string().required().label("Plain Meter Id"),
  vName: Joi.string().required().label("Name").trim(),
});

module.exports = updateSchema;
