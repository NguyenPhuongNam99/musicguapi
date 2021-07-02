const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const trackPlaylist = function (trackPlaylist = {}) {
  this.track = trackPlaylist.title || null;
  this.youtubeTrack = trackPlaylist.youtubeTrack || null;
  this.playlist = trackPlaylist.thumbnail || null;
  this.createdAt = trackPlaylist.createdAt || null;
  this.updatedAt = trackPlaylist.updatedAt || null;
};

////////////////////////////////////////////////////////////////////////////////
trackPlaylist.deleteByTrackAndPlaylist = (trackPlaylist) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `DELETE FROM trackPlaylist WHERE trackYoutube = ? AND playlist = ?`,
        [trackPlaylist.trackYoutube, trackPlaylist.playlist],
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
trackPlaylist.deleteByPlaylist = (playlist) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `DELETE FROM trackPlaylist WHERE playlist = ?`,
        playlist,
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
trackPlaylist.create = (trackPlaylist) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "INSERT INTO trackPlaylist SET ?",
        trackPlaylist,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          return resolve({
            trackPlaylistId: res.insertId,
            ...trackPlaylist,
          });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
trackPlaylist.deleteById = (trackPlaylistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `DELETE FROM trackPlaylist WHERE trackPlaylistId = ?`,
        trackPlaylistId,
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
trackPlaylist.getByPlaylist = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
          *
        FROM
          trackPlaylist tp
        WHERE
          tp.playlist = ?
        `,
        playlistId,
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

module.exports = trackPlaylist;
