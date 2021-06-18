const jwt = require("jsonwebtoken");
const { createError } = require("../common/createError");

module.exports.verifyToken = (req, res, next) => {
  try {
    const tokenHeader = req.get("Authorization");
    if (!tokenHeader) throw createError(401, "Unauthorized");
    const tokenArray = tokenHeader.split(" ");
    const dataToken = jwt.verify(tokenArray[1], process.env.TOKEN_SECURE);

    if (!dataToken) throw createError(401, "Unauthorized");
    req.dataToken = dataToken;
    if (
      dataToken.exp * 1000 - new Date().getTime() <
      process.env.TOKEN_DATE_REFRESH
    ) {
      req.newToken = jwt.sign(
        {
          accountId: dataToken.accountId,
          accountType: dataToken.accountType,
          profileId: dataToken.profileId,
          profileType: dataToken.profileType,
        },
        process.env.TOKEN_SECURE,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }
      );
    } else {
      req.newToken = tokenArray[1];
    }
    next();
  } catch (error) {
    next(error);
  }
};
