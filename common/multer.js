var multer = require("multer");

// const productStorage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "./public/images/products");
//   },
//   // in case you want to change the names of your files)
//   filename(req, file = {}, cb) {
//     // file.mimetype = "audio/webm";
//     // console.log(req)
//     const { originalname } = file;
//     const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
//     cb(
//       null,
//       `product_${file.fieldname}_${Date.now()}_${Math.floor(
//         Math.random() * 999999
//       )}${fileExtension}`
//     );
//   },
// });

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/images");
  },
  // in case you want to change the names of your files)
  filename(req, file = {}, cb) {
    // file.mimetype = "audio/webm";
    // console.log(req)
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    cb(
      null,
      `${file.fieldname}_${Date.now()}_${Math.floor(
        Math.random() * 999999
      )}${fileExtension}`
    );
  },
});

// module.exports.productImageMulter = multer({ storage: productStorage });
module.exports.imageMulter = multer({ storage: imageStorage });
