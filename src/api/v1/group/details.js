const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vGroupId: Joi.string().required().label("Group Id"),
});

module.exports = getDetailSchema;
