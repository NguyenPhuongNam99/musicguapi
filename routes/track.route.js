const router = require("express").Router();
const trackController = require("../controllers/track.controller");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/get", verifyToken, trackController.getById);
router.get("/get/trending", verifyToken, trackController.getTrending);
router.get("/play", trackController.playById);

module.exports = router;
