const router = require("express").Router();
const channelController = require("../controllers/channel.controller");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/getbyid", verifyToken, channelController.getbyid);

module.exports = router;
