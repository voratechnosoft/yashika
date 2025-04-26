const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vNotificationId: Joi.string().required().label("Notification Id"),
});

module.exports = getDetailSchema;
