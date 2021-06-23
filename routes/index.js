const router = require("express").Router();

const authRoute = require("./auth.route");
const trackRoute = require("./track.route");
const playlistRoute = require("./playlist.route");

router.use("/auth", authRoute);
router.use("/track", trackRoute);
router.use("/playlist", playlistRoute);

module.exports = router;
