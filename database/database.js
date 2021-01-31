module.exports = function(caller) {
    const mysql = require("mysql");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "01234567",
        database: "photodit"
    });

    connection.connect(function(err) {
        let moduleContent = undefined;
        if(err) {
            moduleContent = require("./false-database");
        } else {
            moduleContent = require("./true-database")(connection);
        }
        caller(moduleContent);
    });
};
