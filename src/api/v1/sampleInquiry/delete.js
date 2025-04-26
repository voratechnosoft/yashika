const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vSampleInquiryId: Joi.string().required().label("Sample Inquiry Id"),
});

module.exports = deleteSchema;
