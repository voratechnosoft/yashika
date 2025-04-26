const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vGroupId: Joi.string().required().label("Group Id"),
  vGroupName: Joi.string().required().label("Group Name").trim(),
  arrUserId: Joi.array().required().label("User Id"),
  vGroupLinkImage: Joi.string().label("Group Link Image").allow(""),
});

module.exports = updateSchema;
