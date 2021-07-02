const { createError } = require("../common/createError");
const { youtubeService } = require("../common/googleService");
const { getChannelValidation } = require("../common/validation");

//////////////////////////////////////////////////////////////////////////////////

module.exports.getbyid = async (req, res, next) => {
  try {
    const bodyValidation = getChannelValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    let requestId = null;
    if (bodyValidation.value.youtubeChannelId) {
      requestId = bodyValidation.value.youtubeChannelId;
    } else {
      // if (bodyValidation.value.videoId) {
      //   const track = await trackModel.findYoutubeVideoIdById(
      //     bodyValidation.value.videoId
      //   );
      //   if (!track || !track[0]) {
      //     throw createError(401, "The track does not match!");
      //   }
      //   requestId = track[0].youtubePlaylistId;
      // }
    }
    youtubeService.channels.list(
      {
        part: "brandingSettings, contentDetails, contentOwnerDetails, localizations, statistics, status, topicDetails, snippet",
        id: requestId,
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
