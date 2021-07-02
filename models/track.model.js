const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const Track = function (profile = {}) {
  this.title = profile.title;
  this.album = profile.album;
  this.thumbnail = profile.thumbnail;
  this.path = profile.path;
  this.size = profile.size;
  this.duration = profile.duration;
  this.type = profile.type;
  this.status = profile.status;
  this.createdAt = profile.createdAt;
  this.updatedAt = profile.updatedAt;
};
////////////////////////////////////////////////////////////////////////////////
Track.findById = (trackId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
        t.*,
        GROUP_CONCAT(t2.label) as "trackTypes",
        i.path as "thumbnailPath",
        i.alt as "thumbnailAlt",
        s.name as "statusName",
        pl.title as "albumTitle"
        FROM
          track t
        LEFT JOIN trackType tt ON
          t.trackId = tt.track
        LEFT JOIN type t2 ON
          tt.type = t2.typeId
        LEFT JOIN image i ON
          t.thumbnail = i.imageId
        LEFT JOIN status s ON
          t.status = s.statusId
        LEFT JOIN playlist pl ON
          t.album = pl.playlistId
        WHERE
          t.trackId = ?
        GROUP BY
        t.trackId
        LIMIT 0,
        1`,
        trackId,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          return resolve(res);
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
Track.findYoutubeVideoIdById = (trackId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT youtubeVideoId FROM track WHERE trackId = ? LIMIT 0, 1`,
        trackId,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          return resolve(res);
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

module.exports = Track;
