const Message = require("./messages");
const { successAction, failAction } = require("../utils/response");
module.exports = async function (req, res, next) {
  try {
    let {
      body = {},
      user = {},
      query = {},
      params = {},
      files = [],
      file = {},
      headers,
    } = req;

    const { isRequestValidateRequired = false, schemaValidate = {} } = this;
    if (isRequestValidateRequired) {
      const { error = null, value = {} } = schemaValidate.validate(body);
      if (error)
        return res
          .status(400)
          .json(
            failAction(
              error.details[0].message.toString().replace(/[\""]+/g, "")
            )
          );
      body = { ...body, ...value };
    }
    this["modelService"]({
      body,
      user,
      query,
      params,
      files,
      file,
      headers,
    }).then(
      (success) => {
        if (success?.isHeaderSet) {
          for (let key in success.headerValue) {
            res.setHeader(key, success.headerValue[key]);
          }
          delete success.isHeaderSet;
          delete success.headerValue;
        }
        return res
          .status(200)
          .json(
            successAction(
              success?.data ? success?.data : success,
              Message?.success,
              success?.iCount
            )
          );
      },
      (error) => {
        console.error("than catch error=>", error);
        let errorMessage = Message[error.message]
          ? Message[error.message]
          : error.message;
        return res.status(400).json(failAction(errorMessage));
      }
    );
  } catch (e) {
    console.error("catch block error=>", e);
    res.status(400).json(failAction(Message.systemError));
  }
};
