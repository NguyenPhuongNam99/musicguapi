const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const Playlist = function (profile = {}) {
  this.title = profile.title || null;
  this.thumbnail = profile.thumbnail || null;
  this.createdAt = profile.createdAt || null;
  this.updatedAt = profile.updatedAt || null;
};
////////////////////////////////////////////////////////////////////////////////
Playlist.getById = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `
          SELECT
            p.*,
            i.path as "thumbnailPath",
            i.alt as "thumbnailAlt"
          FROM
            playlist p
          LEFT JOIN playlistType pt ON
            p.playlistId = pt.playlist
          LEFT JOIN image i ON
            p.thumbnail = i.imageID
          WHERE
            p.playlistId = ?
          GROUP BY
            p.playlistId
          LIMIT 0,
          1
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
////////////////////////////////////////////////////////////////////////////////
Playlist.checkExistsById = (playlistId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `
          SELECT
            p.playlistId
          FROM
            playlist p
          WHERE
            p.playlistId = ?
          LIMIT 0,
          1
        `,
        playlistId,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (!res.length) {
            return resolve(false);
          }
          return resolve(true);
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
Playlist.existsByIdAndProfile = (playlistId, profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `
          SELECT
            p.playlistId
          FROM
            playlist p
          WHERE
            p.playlistId = ?
          AND
            p.profile = ?
          LIMIT 0,
          1
        `,
        [playlistId, profileId],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (!res.length) {
            return resolve(false);
          }
          return resolve(true);
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
Playlist.checkExistsByIdAndProfile = (playlistId, profile) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `
          SELECT
            p.playlistId
          FROM
            playlist p
          WHERE
            p.playlistId = ? AND
            p.profile = ?
          LIMIT 0,
          1
        `,
        [playlistId, profile],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (!res.length) {
            return resolve(false);
          }
          return resolve(true);
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
Playlist.createPlaylist = (newPlaylist) => {
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

Playlist.deleteByIdAndProfile = (playlistId, profileID) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM playlist WHERE playlistId = ? AND profile = ?",
        [playlistId, profileID],
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

Playlist.getByProfile = (profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
          p.*,
          i.path as "thumbnailPath",
          i.alt as "thumbnailAlt"
        FROM
          playlist p
        LEFT JOIN image i ON
          p.thumbnail = i.imageID
        WHERE
          p.profile = ?
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
          p.playlistId = ?
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
