const router = require("express").Router();
const commonController = require("../controllers/common.controller");
const { verifyToken } = require("../middlewares/token.middleware");

//private

router.get("/search", verifyToken, commonController.search);

module.exports = router;
