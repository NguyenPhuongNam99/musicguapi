const pool = require("../database/mysql.database");

const Profile = function (profile = {}) {
  this.fullName = profile.fullName;
  this.email = profile.email;
  this.avatar = profile.avatar;
  this.youtubeAccount = profile.youtubeAccount;
  this.type = profile.type;
  this.status = profile.status;
  this.createdAt = profile.createdAt;
  this.updatedAt = profile.updatedAt;
};

Profile.prototype.findByEmail = (email, cb) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) reject(errorConnection);
      pool.query(
        `SELECT profile_id FROM profile WHERE email = ? LIMIT 0, 1`,
        email,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(error);
          }
          return resolve(res);
        }
      );
    });
  });
};

Profile.prototype.create = (newProfile, cb) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) reject(errorConnection);
      pool.query("INSERT INTO profile SET ?", newProfile, (error, res) => {
        connection.release();
        console.log(error);
        if (error) {
          return reject(error);
        }
        return resolve({ profile_id: res.insertId, ...newProfile });
      });
    });
  });
};

module.exports = Profile;
