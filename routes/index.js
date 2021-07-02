const router = require("express").Router();

const commonRoute = require("./common.route");
const authRoute = require("./auth.route");
const trackRoute = require("./track.route");
const playlistRoute = require("./playlist.route");
const channelRoute = require("./channel.route");

router.use("/", commonRoute);
router.use("/auth", authRoute);
router.use("/track", trackRoute);
router.use("/playlist", playlistRoute);
router.use("/channel", channelRoute);

module.exports = router;
