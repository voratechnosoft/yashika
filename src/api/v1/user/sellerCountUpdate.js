const { Joi } = require("../../../utils/schemaValidate");

const sellerCountUpdateSchema = Joi.object({
  vCategoryId: Joi.string().required().label("Category Id"),
});

module.exports = sellerCountUpdateSchema;
