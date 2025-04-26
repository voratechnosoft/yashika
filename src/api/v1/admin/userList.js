const { Joi } = require("../../../utils/schemaValidate");

const userListSchema = Joi.object({
  vSearchText: Joi.string().label("Search Text").allow(""),
  vRoleId: Joi.string().label("Role Id").allow(""),
  isBlock: Joi.boolean().default(false).label("isBlock"),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = userListSchema;
