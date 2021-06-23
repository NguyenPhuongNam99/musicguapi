const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const Profile = function (profile = {}) {
  this.fullName = profile.fullName;
  this.email = profile.email;
  this.avatar = profile.avatar;
  this.youtubeAccount = profile.youtubeAccount;
  this.profileType = profile.profileType;
  this.profileStatus = profile.profileStatus;
  this.createdAt = profile.createdAt;
  this.updatedAt = profile.updatedAt;
};
////////////////////////////////////////////////////////////////////////////////
Profile.findById = (profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT * FROM profile WHERE profileId = ? LIMIT 0, 1`,
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
////////////////////////////////////////////////////////////////////////////////

Profile.updateById = (updateProfile) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `UPDATE
      profile p
      SET
      p.fullName = ?,
      p.youtubeAccount = ?,
      p.avatar = ?
      WHERE
      p.profileId = ?
      LIMIT 1`,
        [
          updateProfile.fullName,
          updateProfile.youtubeAccount,
          updateProfile.avatar,
          updateProfile.profileId,
        ],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }

          if (res.affectedRows == 0) {
            // not found account with the id
            return reject(createError(401, "Your profile does not exist"));
          }
          if (res.changedRows == 0) {
            return reject(
              createError(401, "Your profile don't change anythings")
            );
          }
          return resolve({ status: "successfully" });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

Profile.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
        p.profileId ,
        p.fullName ,
        p.email ,
        p.youtubeAccount ,
        p.profileType ,
        p.profileStatus ,
        p.avatar ,
        i.path as "avatarPath",
        i.alt as "avatarAlt"
        FROM
        profile p
        left join image i ON
        p.avatar = i.imageId
        WHERE
        p.email = ?
        LIMIT 0, 1`,
        email,
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

Profile.create = (newProfile) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query("INSERT INTO profile SET ?", newProfile, (error, res) => {
        connection.release();
        if (error) {
          return reject(createError(500, error.code + error.sqlMessage));
        }
        return resolve({ profileId: res.insertId, ...newProfile });
      });
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

Profile.delete = (profileId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        "DELETE FROM profile WHERE profileId = ?",
        profileId,
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

module.exports = Profile;
