const router = require("express").Router();
const trackController = require("../controllers/track.controller");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/get/:id", verifyToken, trackController.getById);
router.get("/play/:id", trackController.playById);

module.exports = router;
