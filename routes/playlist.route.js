const router = require("express").Router();
const playlistController = require("../controllers/playlist.controller");
const { imageUpload } = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/getbyid", verifyToken, playlistController.getById);
router.get("/getbychannel", verifyToken, playlistController.getByChannelId);
router.get("/getmyplaylist", verifyToken, playlistController.getMyPlaylist);
router.get("/getbyprofile", verifyToken, playlistController.getByProfileId);
router.get("/gettracks/", verifyToken, playlistController.getTracksById);

router.get("/owner/get", verifyToken, playlistController.getMyOwnPlaylist);
router.get("/owner/get/:id", verifyToken, playlistController.getOwnPlaylist);
router.post(
  "/owner/create",
  verifyToken,
  imageUpload,
  playlistController.createOwnPlaylist
);
router.put(
  "/owner/update/:id",
  verifyToken,
  playlistController.updateOwnPlaylist
);
router.put(
  "/owner/changethumbnail/:id",
  verifyToken,
  imageUpload,
  playlistController.changeThumbnailOwnerPlaylist
);
router.delete(
  "/owner/delete/:id",
  verifyToken,
  playlistController.deleteOwnPlaylist
);

router.get("/follow/get", verifyToken, playlistController.getMyFollowPlaylist);
router.get(
  "/follow/get/:id",
  verifyToken,
  playlistController.getFollowPlaylist
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
