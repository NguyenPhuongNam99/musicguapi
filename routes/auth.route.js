const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { imageUpload } = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/token.middleware");
// const userMiddleware = require("../middleware/user.middleware");

//public
router.post("/signup", imageUpload, authController.signupSystem);
router.post("/signin", authController.signin);
router.get("/active/:id", authController.active);
router.get("/resendactive/:username", authController.resendActive);
router.patch("/resetpassword", authController.resetPassword);

// router.get("/signout", authController.signout);

//private

router.get("/signin", verifyToken, authController.resignin);
router.patch("/changepassword", verifyToken, authController.changePassword);
router.put("/changeprofile", verifyToken, authController.changeProfile);
router.put(
  "/changeavatar",
  verifyToken,
  imageUpload,
  authController.changeavatar
);
// router.patch(
//   "/updatepassword",
//   userMiddleware.verifyToken,
//   userController.updatePassword
// );
// router.post('/logout-all', auth, AuthController.logoutAll);

module.exports = router;
