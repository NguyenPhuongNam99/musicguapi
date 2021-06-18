// const pool = require("../database/mysql.database");

// module.exports.findByName = (name, cb) => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((errorConnection, connection) => {
//       if (errorConnection) reject(errorConnection);
//       pool.query(
//         `SELECT profileTypeId FROM profile_type WHERE name = ? LIMIT 0, 1`,
//         name,
//         (error, res) => {
//           connection.release();
//           if (error) {
//             return reject(error);
//           }
//           return resolve(res);
//         }
//       );
//     });
//   });
// };
