const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  vSearchText: Joi.string().label("searchText").allow(""),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = listSchema;
