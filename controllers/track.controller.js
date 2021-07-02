const { createError } = require("../common/createError");
const trackModel = require("../models/track.model");
const fs = require("fs");
var path = require("path");
const {
  youtubeService,
  getYoutubeVideoById,
} = require("../common/googleService");
const youtubeStream = require("youtube-audio-stream");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const urlLib = require("url");
const https = require("https");
const { playVideoValidation } = require("../common/validation");
//////////////////////////////////////////////////////////////////////////////////

module.exports.getById = async (req, res, next) => {
  try {
    const bodyValidation = playVideoValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    let existsTrack = null;
    if (bodyValidation.value.youtubeVideoId) {
      existsTrack = await getYoutubeVideoById(
        bodyValidation.value.youtubeVideoId
      );
      if (existsTrack.pageInfo.totalResults > 0) {
        existsTrack.urlPlayMusic = `https://localhost:4000/track/play?youtubeVideoId=${bodyValidation.value.youtubeVideoId}`;
      }
    }
    if (!existsTrack) throw createError(404, "The playlist not found");
    return res.status(200).send(existsTrack);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getTrending = async (req, res, next) => {
  try {
    const bodyValidation = playVideoValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    youtubeService.videos.list(
      {
        part: "snippet, statistics, topicDetails",
        chart: "mostPopular",
        locale: "Vietnam",
        regionCode: "VN",
        videoCategoryId: 10,
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

//////////////////////////////////////////////////////////////////////////////////

module.exports.playById = async (req, res, next) => {
  try {
    const bodyValidation = playVideoValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    let requestUrl = "http://youtube.com/watch?v=";
    if (bodyValidation.value.youtubeVideoId) {
      requestUrl += bodyValidation.value.youtubeVideoId;
    } else {
      if (bodyValidation.value.videoId) {
        const track = await trackModel.findYoutubeVideoIdById(
          bodyValidation.value.videoId
        );
        if (!track || !track[0]) {
          throw createError(401, "The track does not match!");
        }
        requestUrl += track[0].youtubeVideoId;
      }
    }

    if (!ytdl.validateID(bodyValidation.value.youtubeVideoId)) {
      throw createError(404, "The video not found!");
    }
    const range = req.headers.range;
    if (!range) {
      throw createError(400, "Requires Range");
    }
    const video = ytdl(requestUrl, {
      range: { start: 0, end: 1000 },
      filter: "audioonly",
    });

    video.on("info", (info, format) => {
      var parsed = urlLib.parse(format.url);
      parsed.method = "HEAD";
      https
        .request(parsed, (resHttps) => {
          const videoSize = resHttps.headers["content-length"];
          const chunkSize = 10 ** 6;
          const start = Number(range.replace(/\D/g, ""));
          const end = Math.min(start + chunkSize, videoSize - 1);

          const contentLength = end - start + 1;
          const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
          };
          res.writeHead(206, headers);
          const stream = ytdl(requestUrl, {
            range: { start: start, end: end },
            filter: "audioonly",
          });
          stream.pipe(res);
        })
        .end();
    });
  } catch (error) {
    next(error);
  }
};
