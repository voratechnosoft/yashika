const { Joi } = require("../../../utils/schemaValidate");

const addUserSchema = Joi.object({
  vName: Joi.string().required().label("Name"),
  vMobile: Joi.string().required().label("Mobile"),
  arrUserAccess: Joi.array().required().label("User Access"),
  vUserRoleId: Joi.string().required().label("User Role Id"),
  isAdmin: Joi.boolean().label("Is Admin").default(false),
  isActive: Joi.boolean().label("Active").default(false),
});

module.exports = addUserSchema;
