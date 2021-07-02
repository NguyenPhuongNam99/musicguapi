const { createError } = require("../common/createError");
const {
  createPlaylistValidation,
  playPlaylistValidation,
  followPlaylistValidation,
  addTracksToOwnerPlaylistValidation,
} = require("../common/validation");
const playlistModel = require("../models/playlist.model");
const imageModel = require("../models/image.model");
const profilePlaylistModel = require("../models/profilePlaylist.model");
const typeModel = require("../models/type.model");
const trackPlaylistModel = require("../models/trackPlaylist.model");
const { databaseCode } = require("../database/variable.database");
const {
  youtubeService,
  getYoutubePlaylistById,
  getPlaylistItemsById,
  getYoutubeVideoById,
} = require("../common/googleService");
const ytdl = require("ytdl-core");

//////////////////////////////////////////////////////////////////////////////////

module.exports.getById = async (req, res, next) => {
  try {
    const bodyValidation = playPlaylistValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    let existsPlaylist = null;
    if (bodyValidation.value.youtubePlaylistId) {
      existsPlaylist = await getYoutubePlaylistById(
        bodyValidation.value.youtubePlaylistId
      );
    } else {
      if (bodyValidation.value.playlistId) {
        existsPlaylist = await playlistModel.getById(
          bodyValidation.value.playlistId
        );
      }
    }
    if (!existsPlaylist) throw createError(404, "The playlist not found");
    return res.status(200).send(existsPlaylist);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getByChannelId = async (req, res, next) => {
  try {
    const bodyValidation = playPlaylistValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    if (bodyValidation.value.youtubeChannelId) {
      youtubeService.playlists.list(
        {
          part: "snippet, status, contentDetails, localizations",
          channelId: bodyValidation.value.youtubeChannelId || null,
          pageToken: bodyValidation.value.pageToken || null,
        },
        function (err, response) {
          if (err) {
            console.log("The API returned an error: " + err);
            throw createError(401, "Youtube API V3 Error");
          }
          if (response) {
            return res.status(200).send(response.data);
          }
        }
      );
    } else {
      throw createError(404, "The playlist not found");
    }
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getByProfileId = async (req, res, next) => {
  try {
    if (!req.dataToken || !req.dataToken.profileId)
      throw createError(404, "Don't have a profile");
    const [ownerPlaylist, followPlaylist] = await Promise.all([
      (async () => {
        const existsPlaylists = await playlistModel.getByProfile(
          req.dataToken.profileId
        );
        if (!existsPlaylists) throw createError(404, "The playlist not found");
        return existsPlaylists;
      })(),
      (async () => {
        const existsPlaylists = await profilePlaylistModel.getByProfile(
          req.dataToken.profileId
        );
        if (!existsPlaylists) throw createError(404, "The playlist not found");
        const existsYouTube = await Promise.all(
          existsPlaylists.map(async (existsPlaylist) => {
            return await getYoutubePlaylistById(existsPlaylist.youtubePlaylist);
          })
        );
        return existsYouTube;
      })(),
    ]);

    return res
      .status(200)
      .send({ ownerPlaylist: ownerPlaylist, followPlaylist: followPlaylist });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getTracksById = async (req, res, next) => {
  try {
    const bodyValidation = playPlaylistValidation(req.query);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    let listItems = null;
    if (bodyValidation.value.youtubePlaylistId) {
      listItems = await getPlaylistItemsById(
        bodyValidation.value.youtubePlaylistId,
        bodyValidation.value.pageToken || null
      );
    } else {
      if (bodyValidation.value.playlistId) {
        const existsTracks = await trackPlaylistModel.getByPlaylist(
          bodyValidation.value.playlistId
        );
        if (!existsTracks) throw createError(404, "The playlist not found");
        listItems = await Promise.all(
          existsTracks.map((track) => {
            return getYoutubeVideoById(track.trackYoutube);
          })
        );
      }
    }
    if (!listItems) throw createError(404, "The playlist not found");
    return res.status(200).send(listItems);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.createOwnPlaylist = async (req, res, next) => {
  let savePlaylist = null;
  try {
    const bodyValidation = createPlaylistValidation({
      ...JSON.parse(req.body.content),
      thumbnail: req.body.image,
    });

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    await Promise.all([
      (async () => {
        if (bodyValidation.value.thumbnail) {
          //if create thumbnail
          const newImage = new imageModel(bodyValidation.value.thumbnail);
          saveImage = await imageModel.create(newImage);
        }
      })(),
    ]);

    savePlaylist = await playlistModel.createPlaylist({
      title: bodyValidation.value.title,
      thumbnail: saveImage.imageId,
      profile: req.dataToken.profileId,
      createdAt: bodyValidation.value.createdAt,
      updatedAt: bodyValidation.value.updatedAt,
    });

    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        ...savePlaylist,
        thumbnailPath: saveImage.path,
        thumbnailAlt: saveImage.alt,
      });
  } catch (error) {
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.updateOwnPlaylist = async (req, res, next) => {
  try {
    const bodyValidation = updatePlaylistValidation(req.body);

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    if (req.params.id) {
      const existsPlaylist = await playlistModel.getByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      if (!existsPlaylist || !existsPlaylist[0])
        throw createError(404, "The playlist not found");
      if (bodyValidation.value.title)
        existsPlaylist[0].title = bodyValidation.value.title;
      const result = await playlistModel.updateById(
        req.params.id,
        existsPlaylist[0].title,
        existsPlaylist[0].thumbnail
      );
      if (result.status === "not_found") {
        throw createError(404, "Not Found");
      }
      return res
        .set("Authorization", `Bearer ${req.newToken || ""}`)
        .status(200)
        .send(existsPlaylist[0]);
    } else {
      throw createError(404, "The playlist not found");
    }
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.changeThumbnailOwnerPlaylist = async (req, res, next) => {
  let saveImage = null;
  try {
    if (req.params.id) {
      const existsPlaylist = await playlistModel.getByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      if (!existsPlaylist || !existsPlaylist[0])
        throw createError(404, "The playlist not found");
      if (req.body.image) {
        const newImage = new imageModel(req.body.image);
        saveImage = await imageModel.create(newImage);
        existsPlaylist[0].thumbnail = saveImage.imageId;
        existsPlaylist[0].thumbnailPath = saveImage.path;
        existsPlaylist[0].thumbnailAlt = saveImage.alt;
        const result = await playlistModel.updateById(
          req.params.id,
          existsPlaylist[0].title,
          existsPlaylist[0].thumbnail
        );
        if (result.status === "not_found") {
          throw createError(404, "Not Found");
        }
      }
      return res
        .set("Authorization", `Bearer ${req.newToken || ""}`)
        .status(200)
        .send(existsPlaylist[0]);
    } else {
      throw createError(404, "The playlist not found");
    }
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.deleteOwnPlaylist = async (req, res, next) => {
  let savePlaylist = null;
  try {
    if (req.params.id) {
      const existsPlaylist = await playlistModel.existsByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      if (!existsPlaylist) throw createError(404, "The playlist not found");
      await trackPlaylistModel.deleteByPlaylist(req.params.id);
      await profilePlaylistModel.deleteByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      const result = await playlistModel.deleteByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      if (result.kind === "not_found") {
        throw createError(404, "Not Found");
      }
    } else {
      throw createError(404, "The playlist not found");
    }

    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        meta: {
          status: 200,
          message: "Successfully",
        },
      });
  } catch (error) {
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.createFollowPlaylist = async (req, res, next) => {
  let savePlaylist = null;
  try {
    const bodyValidation = followPlaylistValidation(req.query);

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    if (bodyValidation.value.youtubePlaylist) {
      // const youtubePlaylistIdValid = ytdl.validateID(
      //   bodyValidation.value.youtubePlaylistId
      // );
      // if (!youtubePlaylistIdValid)
      //   throw createError(404, "The youtube playlist not found");
      savePlaylist = await profilePlaylistModel.create({
        profile: req.dataToken.profileId,
        youtubePlaylist: bodyValidation.value.youtubePlaylist,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });
    } else {
      if (bodyValidation.value.playlist) {
        const playlistIdValid = await playlistModel.checkExistsById(
          bodyValidation.value.playlist
        );
        if (!playlistIdValid) throw createError(404, "The playlist not found");
        savePlaylist = await profilePlaylistModel.create({
          profile: req.dataToken.profileId,
          playlist: bodyValidation.value.playlist,
          createdAt: bodyValidation.value.createdAt,
          updatedAt: bodyValidation.value.updatedAt,
        });
      }
    }
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        meta: {
          status: 200,
          message: "Successfully",
        },
      });
  } catch (error) {
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.deleteFollowPlaylist = async (req, res, next) => {
  let savePlaylist = null;
  try {
    if (req.params.id) {
      const result = await profilePlaylistModel.deleteByIdAndProfile(
        req.params.id,
        req.dataToken.profileId
      );
      if (result.kind === "not_found") {
        throw createError(404, "Not Found");
      }
    }
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        meta: {
          status: 200,
          message: "Successfully",
        },
      });
  } catch (error) {
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.addTracksToOwnerPlaylist = async (req, res, next) => {
  try {
    const bodyValidation = addTracksToOwnerPlaylistValidation(req.body);

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    const playlistExists = await playlistModel.checkExistsByIdAndProfile(
      bodyValidation.value.playlist,
      req.dataToken.profileId
    );

    if (!playlistExists)
      throw createError(
        404,
        "The playlist not found or you can't add tracks to this playlist"
      );

    await Promise.all(
      bodyValidation.value.tracks.map(async (track) => {
        if (ytdl.validateID(track))
          await trackPlaylistModel.create({
            trackYouTube: track,
            playlist: bodyValidation.value.playlist,
          });
      })
    );

    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        meta: {
          status: 200,
          message: "Successfully",
        },
      });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.deleteTracksToOwnerPlaylist = async (req, res, next) => {
  try {
    const bodyValidation = addTracksToPlaylistValidation(req.body);

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    const playlistExists = await playlistModel.checkExistsByIdAndProfile(
      bodyValidation.value.playlist,
      req.dataToken.profileId
    );

    if (!playlistExists)
      throw createError(
        404,
        "The playlist not found or you can't add tracks to this playlist"
      );

    await Promise.all(
      bodyValidation.value.tracks.map(async (track) => {
        if (ytdl.validateID(track)) await trackPlaylistModel.deleteById(track);
      })
    );

    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send({
        meta: {
          status: 200,
          message: "Successfully",
        },
      });
  } catch (error) {
    next(error);
  }
};
