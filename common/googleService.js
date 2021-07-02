const { google } = require("googleapis");

const youtubeService = google.youtube({
  version: "v3",
  auth: process.env.BACKEND_YOUTUBE_API_KEY,
});
module.exports.youtubeService = youtubeService;
module.exports.getYoutubePlaylistById = (youtubePlaylistId) => {
  return new Promise((resolve, reject) => {
    youtubeService.playlists.list(
      {
        part: "snippet, status, contentDetails, localizations",
        id: youtubePlaylistId || null,
      },
      function (err, response) {
        if (err) {
          reject(createError(404, "The playlist Youtube API V3 not found"));
        }
        if (response) {
          resolve(response.data);
        }
      }
    );
  });
};
