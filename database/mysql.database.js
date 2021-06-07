const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "VuMinhChau_2652",
  database: "musicgudev",
});

pool.on("connection", function (connection) {
  connection.query("SET SESSION auto_increment_increment=1");
});

pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});

// return connection.connect(function (err) {
//   if (err) {
//     console.error("error connecting: " + err.stack);
//     return;
//   }

//   console.log("connected as id " + connection.threadId);
// });

const sql = "SELECT version();";

const attemptConnection = () =>
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("Error connecting to database. Retrying in 1 sec");
      setTimeout(attemptConnection, 1000);
    } else {
      connection.query(sql, (errQuery, results) => {
        connection.release();
        if (errQuery) {
          console.log("Error querying database!");
        } else {
          console.log(
            `Successfully queried database ${results[0][`version()`]}.`
          );
        }
      });
    }
  });

attemptConnection();

module.exports = pool;
