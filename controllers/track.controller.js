const { createError } = require("../common/createError");
const trackModel = require("../models/track.model");
const fs = require("fs");
var path = require("path");

//////////////////////////////////////////////////////////////////////////////////

module.exports.getById = async (req, res, next) => {
  try {
    const track = await trackModel.findById(req.params.id);
    if (!track || !track[0]) {
      throw createError(401, "The track does not match!");
    }
    track[0].trackTypes = track[0].trackTypes
      ? track[0].trackTypes.split(",")
      : null;
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send(track[0]);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.playById = async (req, res, next) => {
  try {
    const track = await trackModel.findPathById(req.params.id);
    if (!track || !track[0]) {
      throw createError(401, "The track does not match!");
    }
    const videoPath = path.join(
      path.dirname(require.main.filename),
      track[0].trackPath
    );
    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;
    if (!range) {
      throw createError(400, "Requires Range header");
    }

    // //parse Range
    // //Ex: "bytes=32324-"
    const chunkSize = 1e6; //1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Range": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const stream = fs.createReadStream(videoPath, { start, end });

    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};
