const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { imageUpload } = require("../middlewares/multer.middleware");
// const userMiddleware = require("../middleware/user.middleware");

//public
router.post("/signup", imageUpload, authController.signup);

// router.get("/signout", authController.signout);
// router.post("/signin", authController.signin);

//private

// router.patch(
//   "/updatepassword",
//   userMiddleware.verifyToken,
//   userController.updatePassword
// );
// router.post('/logout-all', auth, AuthController.logoutAll);

module.exports = router;
