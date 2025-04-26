const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vGroupId: Joi.string().required().label("Group Id"),
});
module.exports = deleteSchema;
