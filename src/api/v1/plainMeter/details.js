const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vPlainMeterId: Joi.string().required().label("Plain Meter Id"),
});

module.exports = getDetailSchema;
