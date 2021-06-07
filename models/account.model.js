const pool = require("../database/mysql.database");

const Account = function (accout = {}) {
  this.email = accout.email;
  this.password = accout.password;
  this.type = accout.type;
  this.socialAuthorization = accout.socialAuthorization;
  this.profile = accout.profile;
  this.createdAt = accout.createdAt;
  this.updatedAt = accout.updatedAt;
};

Account.prototype.create = (newAccount, result) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorConnection, connection) => {
      if (errorConnection) reject(errorConnection);
      pool.query("INSERT INTO account SET ?", newAccount, (error, res) => {
        connection.release();
        if (error) {
          return reject(error);
        }
        console.log(res);
        console.log("created customer: ", { id: res.insertId, ...newAccount });
        return resolve({ id: res.insertId, ...newAccount });
      });
    });
  });
};

module.exports = Account;
