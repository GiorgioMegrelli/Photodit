/*
    Independ Module
*/

const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "01234567",
    database: "photodit"
});


const lines = [
    "DELETE FROM Likes WHERE true;",
    "DELETE FROM Followings WHERE true;",
    "DELETE FROM Comments WHERE true;",
    "DELETE FROM Photos WHERE true;",
    "DELETE FROM Users WHERE true;",
    "ALTER TABLE Users AUTO_INCREMENT = 1;",
    "ALTER TABLE Photos AUTO_INCREMENT = 1;",
    "ALTER TABLE Comments AUTO_INCREMENT = 1;"
];

connection.connect(function(err) {
    if(err) console.log(err);
    let counter = 0;
    lines.forEach(function(item) {
        connection.query(item, function(err, result) {
            if(err) {
                console.log(err);
            }
            counter += result.affectedRows;
        });
    });
    console.log("Rows Affected: ", counter);
    connection.end();
    console.log("Connection Ended!");
});
