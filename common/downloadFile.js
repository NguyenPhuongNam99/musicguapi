const fs = require("fs");
const fetch = require("node-fetch");

module.exports.downloadImage = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newName = `downloadimage_${Date.now()}_${Math.floor(
        Math.random() * 999999
      )}.png`;
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(
        `/media/troutrous/Work/Nodejs/Hiwin/musicgu/public/images/${newName}`,
        buffer
      );
      const stats = fs.statSync(
        `/media/troutrous/Work/Nodejs/Hiwin/musicgu/public/images/${newName}`
      );
      resolve({
        path: newName,
        alt: url.slice(0, 38),
        size: stats.size,
      });
    } catch (error) {
      reject(error);
    }
  });
};
