const { Joi } = require("../../../utils/schemaValidate");

const userInquiryRequestSchema = Joi.object({
  requestStatus: Joi.number().label("Request Status"),
  iPage: Joi.number().default(1),
  iLimit: Joi.number().default(10),
});

module.exports = userInquiryRequestSchema;
