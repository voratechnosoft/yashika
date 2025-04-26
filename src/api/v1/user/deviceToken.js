const { Joi } = require("../../../utils/schemaValidate");

const deviceTokenSchema = Joi.object({
  vDeviceToken: Joi.string().required().label("Device Token"),
});

module.exports = deviceTokenSchema;
