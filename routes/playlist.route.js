const router = require("express").Router();
const playlistController = require("../controllers/playlist.controller");
const { imageUpload } = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/getbyid", verifyToken, playlistController.getById);
router.get("/getbychannel", verifyToken, playlistController.getByChannelId);
router.get("/getbyprofile", verifyToken, playlistController.getByProfileId);
router.get("/gettracks/", verifyToken, playlistController.getTracksById);

router.post(
  "/owner/create",
  verifyToken,
  imageUpload,
  playlistController.createOwnPlaylist
);
router.delete(
  "/owner/delete/:id",
  verifyToken,
  playlistController.deleteOwnPlaylist
);

router.post(
  "/follow/create",
  verifyToken,
  playlistController.createFollowPlaylist
);
router.delete(
  "/follow/delete/:id",
  verifyToken,
  playlistController.deleteFollowPlaylist
);
router.post(
  "/owner/addtracks",
  verifyToken,
  playlistController.addTracksToOwnerPlaylist
);
router.delete(
  "/owner/deletetracks",
  verifyToken,
  playlistController.deleteTracksToOwnerPlaylist
);

module.exports = router;
