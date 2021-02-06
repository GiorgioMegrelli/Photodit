module.exports = function(caller) {
    let moduleContent = require("./false-database");
    caller(moduleContent);
};
