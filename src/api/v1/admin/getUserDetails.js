const { Joi } = require("../../../utils/schemaValidate");

const getUserDetailSchema = Joi.object({
  vUserId: Joi.string().required().label("User Id"),
});

module.exports = getUserDetailSchema;
