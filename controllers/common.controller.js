const { createError } = require("../common/createError");
const { youtubeService } = require("../common/googleService");
const { searchValidation } = require("../common/validation");

//////////////////////////////////////////////////////////////////////////////////

module.exports.search = async (req, res, next) => {
  try {
    const bodyValidation = searchValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    youtubeService.search.list(
      {
        part: "snippet",
        type: bodyValidation.value.type,
        order: bodyValidation.value.order,
        q: bodyValidation.value.q || "",
        channelId: bodyValidation.value.channelId || null,
        pageToken: bodyValidation.value.pageToken || null,
      },
      function (err, response) {
        if (err) {
          throw createError(401, "Youtube API V3 Error");
        }
        if (response) {
          return res.status(200).send(response.data);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
