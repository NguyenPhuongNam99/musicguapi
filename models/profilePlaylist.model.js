const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const profilePlaylist = function (profilePlaylist = {}) {
  this.profile = profilePlaylist.title || null;
  this.playlist = profilePlaylist.thumbnail || null;
  this.youtubePlaylist = profilePlaylist.youtubePlaylist || null;
  this.createdAt = profilePlaylist.createdAt || null;
  this.updatedAt = profilePlaylist.updatedAt || null;
};

////////////////////////////////////////////////////////////////////////////////
profilePlaylist.create = (profilePlaylist) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "INSERT INTO profilePlaylist SET ?",
        profilePlaylist,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          return resolve({
            profilePlaylistId: res.insertId,
            ...profilePlaylist,
          });
        }
      );
    });
  });
};
////////////////////////////////////////////////////////////////////////////////

profilePlaylist.deleteByIdAndProfile = (profilePlaylistId, profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM profilePlaylist WHERE profilePlaylistId = ? AND profile = ?",
        [profilePlaylistId, profileId],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            return resolve({ kind: "not_found" });
          }
          return resolve({ kind: "successfully" });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

profilePlaylist.deleteByPlaylistAndProfile = (playlistId, profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM profilePlaylist WHERE playlist = ? AND profile = ?",
        [playlistId, profileID],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            return resolve({ kind: "not_found" }, null);
          }
          return resolve({ kind: "successfully" });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

profilePlaylist.getByProfile = (profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
          *
        FROM
          profilePlaylist pp
        WHERE
          pp.profile = ?
        `,
        profileId,
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
module.exports = profilePlaylist;
