const { Joi } = require("../../../utils/schemaValidate");

const updateUserSchema = Joi.object({
  vUserId: Joi.string().required().label("User Id"),
  vName: Joi.string().required().label("Name"),
  vMobile: Joi.string().required().label("Mobile"),
  arrUserAccess: Joi.array().required().label("User Access"),
  vUserRoleId: Joi.string().required().label("User Role Id"),
  isActive: Joi.boolean().label("Active").default(false),
  vProfileLinkImage: Joi.string().label("Profile Link Image").allow(""),
});

module.exports = updateUserSchema;
