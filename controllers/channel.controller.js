const { createError } = require("../common/createError");
const { youtubeService, getChannelById } = require("../common/googleService");
const { getChannelValidation } = require("../common/validation");

//////////////////////////////////////////////////////////////////////////////////

module.exports.getbyid = async (req, res, next) => {
  try {
    const bodyValidation = getChannelValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    if (bodyValidation.value.youtubeChannelId) {
      const existsChannel = await getChannelById(
        bodyValidation.value.youtubeChannelId
      );
      return res.status(200).send(existsChannel);
    }
  } catch (error) {
    next(error);
  }
};
