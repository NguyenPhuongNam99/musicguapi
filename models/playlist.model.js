const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const Playlist = function (profile = {}) {
  this.title = profile.title || null;
  this.thumbnail = profile.thumbnail || null;
  this.size = profile.size || null;
  this.duration = profile.duration || null;
  this.status = profile.status || null;
  this.createdAt = profile.createdAt || null;
  this.updatedAt = profile.updatedAt || null;
};
////////////////////////////////////////////////////////////////////////////////
Playlist.findById = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
          p.*,
          GROUP_CONCAT(t2.label) as "playlistTypes",
          i.path as "thumbnailPath",
          i.alt as "thumbnailAlt",
          s.name as "statusName"
        FROM
          playlist p
        LEFT JOIN playlistType pt ON
          p.playlistId = pt.playlist
        LEFT JOIN type t2 ON
          pt.type = t2.typeId
        LEFT JOIN image i ON
          p.thumbnail = i.imageID
        LEFT JOIN status s ON
          p.status = s.statusId
        WHERE
          p.playlistId = ?
        GROUP BY
          p.playlistId
        LIMIT 0,
          1`,
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
////////////////////////////////////////////////////////////////////////////////
Playlist.createProfilePlaylist = (profilePlaylist) => {
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
Playlist.create = (newPlaylist) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query("INSERT INTO playlist SET ?", newPlaylist, (error, res) => {
        connection.release();
        if (error) {
          return reject(createError(500, error.code + error.sqlMessage));
        }
        return resolve({ playlistId: res.insertId, ...newPlaylist });
      });
    });
  });
};
////////////////////////////////////////////////////////////////////////////////

Playlist.delete = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM playlist WHERE playlistId = ?",
        playlistId,
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

Playlist.deleteProfilePlaylist = (profilePlaylistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM profilePlaylist WHERE profilePlaylistId = ?",
        profilePlaylistId,
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

Playlist.findByProfile = (profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
          p.*,
          GROUP_CONCAT(t2.label) as "playlistTypes",
          i.path as "thumbnailPath",
          i.alt as "thumbnailAlt",
          s.name as "statusName"
        FROM
          playlist p
        LEFT JOIN profilePlaylist pp ON
          p.playlistId = pp.playlist
        LEFT JOIN playlistType pt ON
          p.playlistId = pt.playlist
        LEFT JOIN type t2 ON
          pt.type = t2.typeId
        LEFT JOIN image i ON
          p.thumbnail = i.imageID
        LEFT JOIN status s ON
          p.status = s.statusId
        WHERE
          pp.profile = ?
        GROUP BY
          p.playlistId
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

Playlist.findTracksById = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `
        SELECT
          t.*,
          i.path as "thumbnailPath",
          i.alt as "thumbnailAlt",
          s.name as "statusName"
        FROM
          track t
        LEFT JOIN trackPlaylist tp ON
          t.trackId = tp.track
        LEFT JOIN image i ON
          t.thumbnail = i.imageId
        LEFT JOIN status s ON
          t.status = s.statusId
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

module.exports = Playlist;
