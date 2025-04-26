const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vSampleInquiryId: Joi.string().required().label("Sample Inquiry Id"),
});

module.exports = getDetailSchema;
