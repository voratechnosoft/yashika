const dbService = require("../../utils/dbService");
const { failAction } = require("../../utils/response");
const Message = require("../../utils/messages");

const authentication = async function (req, res, next) {
  try {
    const { body, headers, path, originalUrl } = req;
    const { authorization, host } = headers;
    const data = {};
    data.format = "request";
    data.path = path;
    data.body = body;
    data.originalUrl = originalUrl;
    data.headers = { authorization, host, userAgent: headers["user-agent"] };

    const Authorization =
      data["headers"]["Authorization"] || data["headers"]["authorization"];
    if (!Authorization) {
      return res.status(401).json(failAction("Authorization not found!", 401));
    }

    const AuthorizationToken = Authorization.replace("Bearer ", "");

    let filter = { vLoginToken: AuthorizationToken };
    let userData = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
    });

    if (!userData || userData === null || userData === undefined)
      return res.status(401).json(failAction(Message.tokenExpire, 401));
    let userInfo = { _id: userData._id };
    res.setHeader("Access-Control-Expose-Headers", "X-main-user-timezone");
    req.user = userInfo;
    next();
  } catch (error) {
    return res.status(401).json(failAction(Message.tokenExpire, 401));
  }
};

module.exports = authentication;
