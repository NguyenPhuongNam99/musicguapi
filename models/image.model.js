const pool = require("../database/mysql.database");

const Image = function (image) {
  this.imagePath = image.path;
  this.imageAlt = image.alt;
  this.imageSize = image.size;
  this.createdAt = image.createdAt;
  this.updatedAt = image.updatedAt;
};

Image.create = (newImage) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) reject(errorConnection);
      pool.query("INSERT INTO image SET ?", newImage, (error, res) => {
        connection.release();
        if (error) {
          return reject(error);
        }
        return resolve({ imageId: res.insertId, ...newImage });
      });
    });
  });
};

module.exports = Image;
