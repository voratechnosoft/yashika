const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vCategoryId: Joi.string().required().label("Category Id"),
});

module.exports = getDetailSchema;
