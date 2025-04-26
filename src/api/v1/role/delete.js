const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vRoleId: Joi.string().required().label("Role Id"),
});
module.exports = deleteSchema;
