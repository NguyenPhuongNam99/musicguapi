const { imageMulter } = require("../common/multer");

// module.exports.productImageUpload = (req, res, next) => {
//   productImageMulter.single("images")(req, res, function (err) {
//     if (err) {
//       res.status(401).send({
//         message: err.message || "Something has been error...",
//       });
//       return;
//     } else {
//       if (req.file) {
//         req.body.images = `https://${req.get("host")}/${req.file.path}`;
//       }
//       next();
//     }
//   });
// };
module.exports.imageUpload = (req, res, next) => {
  imageMulter.single("image")(req, res, function (err) {
    if (err) {
      res.status(400).send({
        message: err.message || "Something has been error...",
      });
      return;
    } else {
      if (req.file) {
        req.body.image = {
          path: `https://${req.get("host")}/${req.file.path}`,
          alt: req.file.originalname,
          size: req.file.size,
        };
      }
      next();
    }
  });
};
