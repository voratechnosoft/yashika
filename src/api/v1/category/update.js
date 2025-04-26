const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vCategoryId: Joi.string().required().label("Category Id"),
  vName: Joi.string().required().label("Category Name").trim(),
  vCategoryLinkImage: Joi.string().label("Category Link Image").allow(""),
});

module.exports = updateSchema;
