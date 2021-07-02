const Joi = require("joi");

module.exports.signupValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(16).trim().required(),
    socialAuthorization: Joi.string().trim().default(null),
    fullName: Joi.string().trim().default(null).required(),
    youtubeAccount: Joi.string().trim().default(null),
    avatar: {
      path: Joi.string().trim(),
      alt: Joi.string().trim(),
      size: Joi.number().min(0),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    },
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
  });

  return schema.validate(data);
};

module.exports.signupSocialValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().default(null),
    username: Joi.string().email().trim().default(null),
    password: Joi.string().min(8).max(16).trim().default(null),
    accountType: Joi.string().valid("facebook", "google").default("google"),
    profileType: Joi.string().valid("free", "premium").default("free"),
    accountStatus: Joi.string().valid("active", "inactive").default("active"),
    profileStatus: Joi.string()
      .valid("public", "private", "close")
      .default("public"),
    socialAuthorization: Joi.string().trim().required(),
    fullName: Joi.string().trim().default(null).required(),
    youtubeAccount: Joi.string().trim().default(null),
    avatar: {
      path: Joi.string().trim(),
      alt: Joi.string().trim(),
      size: Joi.number().min(0),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    },
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
  });

  return schema.validate(data);
};

module.exports.signinValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().email().trim().default(null),
    password: Joi.string().min(8).max(16).trim().default(null),
    accountType: Joi.string()
      .valid("account_facebook", "account_google", "account_system")
      .default("account_system")
      .required(),
    socialAuthorization: Joi.string().trim().default(null),
    accessToken: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.changePasswordValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(8).max(16).trim().required().default(null),
    newPassword: Joi.string().min(8).max(16).trim().required().default(null),
  });

  return schema.validate(data);
};

module.exports.changeProfileValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().trim().default(null),
    youtubeAccount: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.changeAvatarValidation = (data) => {
  const schema = Joi.object({
    avatar: {
      path: Joi.string().trim().required(),
      alt: Joi.string().trim().required(),
      size: Joi.number().min(0),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    },
  });

  return schema.validate(data);
};

module.exports.createPlaylistValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    thumbnail: {
      path: Joi.string().trim(),
      alt: Joi.string().trim(),
      size: Joi.number().min(0),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    },
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
  });

  return schema.validate(data);
};

module.exports.followPlaylistValidation = (data) => {
  const schema = Joi.object({
    youtubePlaylist: Joi.string().trim().default(null),
    playlist: Joi.string().trim().default(null),
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
  });

  return schema.validate(data);
};

module.exports.playVideoValidation = (data) => {
  const schema = Joi.object({
    youtubeVideoId: Joi.string().trim(),
    videoId: Joi.string().trim(),
    pageToken: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.playPlaylistValidation = (data) => {
  const schema = Joi.object({
    youtubePlaylistId: Joi.string().trim().default(null),
    playlistId: Joi.string().trim().default(null),
    youtubeChannelId: Joi.string().trim().default(null),
    channelId: Joi.string().trim().default(null),
    pageToken: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.getChannelValidation = (data) => {
  const schema = Joi.object({
    youtubeChannelId: Joi.string().trim().default(null),
    channelId: Joi.string().trim().default(null),
    pageToken: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.searchValidation = (data) => {
  const schema = Joi.object({
    type: Joi.string().trim().default("video,channel,playlist"),
    q: Joi.string().trim().default(null),
    order: Joi.string().trim().default("relevance"),
    channelId: Joi.string().trim().default(null),
    pageToken: Joi.string().trim().default(null),
  });

  return schema.validate(data);
};

module.exports.addTracksToOwnerPlaylistValidation = (data) => {
  const schema = Joi.object({
    playlist: Joi.number().min(0),
    tracks: Joi.array().items(Joi.string().trim()),
  });

  return schema.validate(data);
};

module.exports.updatePlaylistValidation = (data) => {
  const schema = Joi.object({
    title: Joi.number().min(0).default(null),
  });

  return schema.validate(data);
};
