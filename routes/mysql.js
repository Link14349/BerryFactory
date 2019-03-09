var mysql = require("mysql");
var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "database": "BerryFactory",
    "password": "061104@zyh",
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("[connection mysql] connect succeed");
});
module.exports = connection;