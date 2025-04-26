const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vName: Joi.string().required().label("Category Name").trim(),
});

module.exports = saveSchema;
