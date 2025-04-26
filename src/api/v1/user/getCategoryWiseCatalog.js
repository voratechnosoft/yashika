const { Joi } = require("../../../utils/schemaValidate");

const getCategoryWiseCatalogSchema = Joi.object({
  vCategoryId: Joi.string().required().label("Category Id"),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = getCategoryWiseCatalogSchema;
