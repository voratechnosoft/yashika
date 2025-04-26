const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vCategoryId: Joi.string().required().label("Category Id"),
});
module.exports = deleteSchema;
