const router = require("express").Router();
const playlistController = require("../controllers/playlist.controller");
const { imageUpload } = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/get/:id", verifyToken, playlistController.getById);
router.get("/getbyprofile/:id", verifyToken, playlistController.getByProfile);
router.get("/gettracks/:id", verifyToken, playlistController.getTracksById);

router.post(
  "/profileplaylist/create",
  verifyToken,
  imageUpload,
  playlistController.createProfilePlaylist
);

module.exports = router;
