const mysql = require("mysql");
const crypto = require("crypto");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "01234567",
    database: "photodit"
});


const tables = {
    "users": "Users",
    "img_fmts": "Img_Formats",
    "photos": "Photos",
    "likes": "Likes",
    "comments": "Comments",
    "followings": "Followings",
    "vis_type": "Visibility_Type",
    "visibility": "Visibility"
};

const imgExtentions = {
    "PNG": 1,
    "GIF": 2,
    "JPG": 3,
    "JPEG": 3
};

const cryptoConfigs = {
    "algorithm": "sha256",
    "digest": "hex"
};


connection.connect(function(err) {
    if(err) console.log(err);
});


function hash(str) {
    return crypto
    .createHash(cryptoConfigs.algorithm)
    .update(str)
    .digest(cryptoConfigs.digest);
}

function addUser(uname, password) {
    const sql = "INSERT INTO " + tables.users + " (USERNAME, PASSWORD) VALUES (?, ?)";
    const username = uname.trim().toLowerCase();
    const hashpass = hash(password.trim());
    connection.query(sql, [username, hashpass], function(err) {
        if(err) {
            console.log(err);
        }
    });
}

function checkPassword(uname, password, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.users + " WHERE USERNAME = ? AND PASSWORD = ?";
    const username = uname.trim().toLowerCase();
    const hashpass = hash(password.trim());
    connection.query(sql, [username, hashpass], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(rows[0].RESULT > 0);
    });
}

function checkUsername(uname, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.users + " WHERE USERNAME = ?";
    const username = uname.trim().toLowerCase();
    connection.query(sql, [username], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(rows[0].RESULT > 0);
    });
}

function getUser(id, caller) {
    const sql = "SELECT USERNAME, CREATE_DATE FROM " + tables.users + " WHERE USER_ID = ?";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            return;
        }
        caller({
            USER_ID: id,
            USERNAME: results[0].USERNAME,
            CREATE_DATE: results[0].CREATE_DATE.toString()
        });
    });
}

function addPhoto() {

}

function photoExists(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.photos + " WHERE PHOTO_ID = ?";
    connection.query(sql, [id], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(rows[0].RESULT > 0);
    });
}

function countLikes(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.likes + " WHERE PHOTO_ID = ?";
    connection.query(sql, [id], function(err, rows) {
        if(err) {
            console.log(err);
            caller(0);
            return;
        }
        caller(rows[0].RESULT);
    });
}

function getLikes(id, caller) {
    const sql = "SELECT LIKER, LIKE_DATE AS RESULT FROM "
    + tables.likes + " WHERE PHOTO_ID = ? ORDER BY LIKE_DATE DESC";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            return;
        }
        caller(results);
    });
}

function countComments(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.comments + " WHERE PHOTO_ID = ?";
    connection.query(sql, [id], function(err, rows) {
        if(err) {
            console.log(err);
            caller(0);
            return;
        }
        caller(rows[0].RESULT);
    });
}

function getComments(id, caller) {
    const sql = "SELECT COMMENTER, COMMENT_DATE AS RESULT FROM "
    + tables.comments + " WHERE PHOTO_ID = ? ORDER BY COMMENT_DATE ASC";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            return;
        }
        caller(results);
    });
}


exports = {
    addUser: addUser,
    checkPassword: checkPassword,
    checkUsername: checkUsername,
    getUser: getUser,
    photoExists: photoExists,
    countLikes: countLikes,
    getLikes: getLikes,
    countComments: countComments,
    getComments: getComments
};
