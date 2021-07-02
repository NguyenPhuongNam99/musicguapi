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
          return reject(
            createError(404, "The playlist Youtube API V3 not found")
          );
        }
        if (response) {
          return resolve(response.data);
        }
      }
    );
  });
};

module.exports.getYoutubeVideoById = (youtubeVideoId) => {
  return new Promise((resolve, reject) => {
    youtubeService.videos.list(
      {
        part: "snippet, statistics, topicDetails, localizations, recordingDetails, status, contentDetails, topicDetails, recordingDetails, liveStreamingDetails",
        id: youtubeVideoId,
      },
      function (err, response) {
        if (err) {
          return reject(createError(404, "The video Youtube API V3 not found"));
        }
        if (response) {
          return resolve(response.data);
        }
      }
    );
  });
};

module.exports.getPlaylistItemsById = (youtubePlaylistId, pageToken) => {
  return new Promise((resolve, reject) => {
    youtubeService.playlistItems.list(
      {
        part: "snippet, status, contentDetails",
        playlistId: youtubePlaylistId || null,
        pageToken: pageToken || null,
      },
      (err, response) => {
        if (err) {
          return reject(createError(401, "Youtube API V3 Error"));
        }
        if (response) {
          return resolve(response.data);
        }
      }
    );
  });
};

module.exports.getChannelById = (youtubeChannelId) => {
  return new Promise((resolve, reject) => {
    youtubeService.channels.list(
      {
        part: "brandingSettings, contentDetails, contentOwnerDetails, localizations, statistics, status, topicDetails, snippet",
        id: youtubeChannelId,
      },
      function (err, response) {
        if (err) {
          return reject(createError(401, "Youtube API V3 Error"));
        }
        if (response) {
          return resolve(response.data);
        }
      }
    );
  });
};
