const { createError } = require("../common/createError");
const { createPlaylistValidation } = require("../common/validation");
const playlistModel = require("../models/playlist.model");
const imageModel = require("../models/image.model");
const typeModel = require("../models/type.model");
//////////////////////////////////////////////////////////////////////////////////

module.exports.getById = async (req, res, next) => {
  try {
    const playlist = await playlistModel.findById(req.params.id);
    if (!playlist || !playlist[0]) {
      throw createError(401, "The playlist does not match!");
    }
    playlist[0].playlistTypes = playlist[0].playlistTypes
      ? playlist[0].playlistTypes.split(",")
      : null;
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send(playlist[0]);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getByProfile = async (req, res, next) => {
  try {
    const playlists = await playlistModel.findByProfile(req.params.id);
    if (!playlists || !playlists[0]) {
      throw createError(401, "The playlist does not match!");
    }
    playlists.forEach((playlist) => {
      playlist.playlistTypes = playlist.playlistTypes
        ? playlist.playlistTypes.split(",")
        : null;
    });
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send(playlists);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.getTracksById = async (req, res, next) => {
  try {
    const playlists = await playlistModel.findTracksById(req.params.id);
    if (!playlists || !playlists[0]) {
      throw createError(401, "The playlist does not match!");
    }
    return res
      .set("Authorization", `Bearer ${req.newToken || ""}`)
      .status(200)
      .send(playlists);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.createProfilePlaylist = async (req, res, next) => {
  let save = null;
  let savePlaylist = null;
  let saveProfilePlaylist = null;
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

    const newPlaylist = new playlistModel({
      ...bodyValidation.value,
      thumbnail: saveImage.imageId,
    });

    savePlaylist = await playlistModel.create(newPlaylist);
    saveProfilePlaylist = await playlistModel.createProfilePlaylist({
      playlist: savePlaylist.playlistId,
      profile: req.dataToken.profileId,
      type: 10,
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
    if (saveProfilePlaylist && saveProfilePlaylist.profilePlaylistId) {
      await playlistModel.deleteProfilePlaylist(
        saveProfilePlaylist.profilePlaylistId
      );
    }
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};

////////////////////////////////////////////////////////////////
module.exports.createProfilePlaylist = async (req, res, next) => {
  let save = null;
  let savePlaylist = null;
  let saveProfilePlaylist = null;
  try {
    const bodyValidation = createPlaylistValidation({
      ...JSON.parse(req.body.content),
      thumbnail: req.body.image,
    });

    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    saveProfilePlaylist = await playlistModel.createProfilePlaylist({
      playlist: savePlaylist.playlistId,
      profile: req.dataToken.profileId,
      type: 11,
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
    if (saveProfilePlaylist && saveProfilePlaylist.profilePlaylistId) {
      await playlistModel.deleteProfilePlaylist(
        saveProfilePlaylist.profilePlaylistId
      );
    }
    if (savePlaylist && savePlaylist.playlistId) {
      await playlistModel.delete(savePlaylist.playlistId);
    }
    next(error);
  }
};
