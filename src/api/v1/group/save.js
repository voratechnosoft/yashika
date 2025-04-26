const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vGroupName: Joi.string().required().label("Group Name").trim(),
  arrUserId: Joi.array().required().label("User Id"),
  vGroupImage: Joi.string().label("Group Image").allow(""),
});

module.exports = saveSchema;
