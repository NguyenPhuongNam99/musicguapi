const { createError } = require("../common/createError");
const pool = require("../database/mysql.database");

const Account = function (account = {}) {
  this.username = account.username || null;
  this.password = account.password || null;
  this.accountType = account.accountType || null;
  this.accountStatus = account.accountStatus || null;
  this.socialAuthorization = account.socialAuthorization || null;
  this.profile = account.profile || null;

  this.createdAt = account.createdAt || null;
  this.updatedAt = account.updatedAt || null;
};

////////////////////////////////////////////////////////////////////////////////

Account.findWithProfileByEmail = (email, type) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
        a.accountId,
        a.username,
        a.password,
        a.accountType,
        a.accountStatus,
        a.socialAuthorization,
        p.profileId,
        p.email,
        p.fullName,
        p.profileType,
        p.profileStatus,
        i.imageId as "avatarId",
        i.path as "avatarPath",
        i.alt as "avatarAlt"
        FROM
          account a
        INNER JOIN profile p ON
          a.profile = p.profileId
        LEFT JOIN image i ON
          p.avatar = i.imageId
        WHERE
          a.username = ? AND a.accountType = ?
        LIMIT 0, 1`,
        [email, type],
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

Account.findWithProfileById = (accountId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
        a.accountId,
        a.username,
        a.password,
        a.accountType,
        a.accountStatus,
        a.socialAuthorization,
        p.profileId,
        p.email,
        p.fullName,
        p.profileType,
        p.profileStatus,
        i.imageId as "avatarId",
        i.path as "avatarPath",
        i.alt as "avatarAlt"
        FROM
          account a
        INNER JOIN profile p ON
          a.profile = p.profileId
        LEFT JOIN image i ON
          p.avatar = i.imageId
        WHERE
          a.accountId = ?
        LIMIT 0, 1`,
        accountId,
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

Account.findWithProfileBySocialAuthorization = (socialAuthorization, type) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT
        a.accountId,
        a.username,
        a.password,
        a.accountType,
        a.accountStatus,
        a.socialAuthorization,
        p.profileId,
        p.email,
        p.fullName,
        p.profileType,
        p.profileStatus,
        i.imageId as "avatarId",
        i.path as "avatarPath",
        i.alt as "avatarAlt"
        FROM
          account a
        INNER JOIN profile p ON
          a.profile = p.profileId
        LEFT JOIN image i ON
          p.avatar = i.imageId
        WHERE
          a.socialAuthorization = ? AND a.accountType = ?
        LIMIT 0, 1`,
        [socialAuthorization, type],
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

Account.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT accountId FROM account WHERE username = ? LIMIT 0, 1`,
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

Account.create = (newAccount) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query("INSERT INTO account SET ?", newAccount, (error, res) => {
        connection.release();
        if (error) {
          return reject(createError(500, error.code + error.sqlMessage));
        }
        return resolve({ accountId: res.insertId, ...newAccount });
      });
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

Account.delete = (accountId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `DELETE FROM account WHERE accountId = ?`,
        accountId,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            return resolve({ status: "failed" });
          }
          return resolve({ status: "successfully" });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

Account.findByIdAndActive = (accountId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `UPDATE
        account a
        SET
        a.accountStatus = 4
        WHERE
        a.accountId = ?
        LIMIT 1`,
        accountId,
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }

          if (res.affectedRows == 0) {
            // not found Customer with the id
            return reject(createError(401, "Your account does not exist"));
          }
          if (res.changedRows == 0) {
            return reject(createError(401, "Your account was active"));
          }
          return resolve({ status: "successfully" });
        }
      );
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

Account.findPasswordById = (accountId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `SELECT accountId, password FROM account WHERE accountId = ? LIMIT 0, 1`,
        accountId,
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

Account.updatePasswordById = (accountId, newPassword) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) return reject(errorConnection);
      pool.query(
        `UPDATE
        account a
        SET
        a.password = ?
        WHERE
        a.accountId = ?
        LIMIT 1`,
        [newPassword, accountId],
        (error, res) => {
          connection.release();
          if (error) {
            return reject(createError(500, error.code + error.sqlMessage));
          }

          if (res.affectedRows == 0) {
            // not found account with the id
            return reject(createError(401, "Your account does not exist"));
          }
          if (res.changedRows == 0) {
            return reject(createError(401, "Your account was active"));
          }
          return resolve({ status: "successfully" });
        }
      );
    });
  });
};

module.exports = Account;
