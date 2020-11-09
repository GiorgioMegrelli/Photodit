const mysql = require("mysql");
const crypto = require("crypto");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "01234567",
    database: "photodit"
});


const tables = {
    users: "Users",
    img_fmts: "Img_Formats",
    photos: "Photos",
    likes: "Likes",
    comments: "Comments",
    followings: "Followings",
    vis_type: "Visibility_Type",
    visibility: "Visibility"
};

const cryptoConfigs = {
    algorithm: "sha256",
    digest: "hex"
};

const imgExtentions = {
    PNG: 1,
    GIF: 2,
    JPG: 3,
    JPEG: 3
};

const imgExtentionsIndex = ["", "PNG", "GIF", "JPEG"];

const visibilities = {
    "PUBLIC": 1,
    "PROTECTED": 2,
    "PRIVATE": 3
};

const visibilitiesIndex = ["", "PUBLIC", "PROTECTED", "PRIVATE"];


connection.connect(function(err) {
    if(err) console.log(err);
});


function hash(str) {
    return crypto
    .createHash(cryptoConfigs.algorithm)
    .update(str)
    .digest(cryptoConfigs.digest);
}

function addUser(uname, password, caller) {
    const sql = "INSERT INTO " + tables.users + " (USERNAME, PASSWORD) VALUES (?, ?)";
    const username = uname.trim().toLowerCase();
    const hashpass = hash(password.trim());
    connection.query(sql, [username, hashpass], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            caller(result.insertId);
        }
    });
}

function getIdByUsername(uname, caller) {
    const sql = "SELECT USER_ID FROM " + tables.users + " WHERE USERNAME = ?";
    const username = uname.trim().toLowerCase();
    connection.query(sql, [username], function(err, rows) {
        if(err) {
            console.log(err);
        } else if(rows.length > 0) {
            caller(rows[0].USER_ID);
        } else {
            caller(-1);
        }
    });
}

function checkUsername(uname, caller) {
    getIdByUsername(uname, function(result) {
        caller(result > 0);
    });
}

function checkPassword(uname, password, caller) {
    /* This function should be called after checkUsername */
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

function checkPassword2(uname, password, caller) {
    const sql = "SELECT PASSWORD FROM " + tables.users + " WHERE USERNAME = ?";
    const username = uname.trim().toLowerCase();
    const hashpass = hash(password.trim());
    connection.query(sql, [username], function(err, results) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        if(rows.length == 0) {
            caller(false);
        } else {
            caller(results[0].PASSWORD === hashpass);
        }
    });
}

function getUser(id, caller) {
    const sql = "SELECT * FROM " + tables.users + " WHERE USER_ID = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
            return;
        }
        result[0].CREATE_DATE = result[0].CREATE_DATE.toString();
        caller(result[0]);
    });
}

function addPhoto(userId, ofilename, desc, type, caller) {
    const sql = "INSERT INTO " + tables.photos
    + " (AUTHOR_ID, FMT_ID, DESCRIPTION, TYPE_ID) VALUES (?, ?, ?, ?)";

    const extention = ofilename.split(".")[1].toUpperCase();
    connection.query(sql, [userId, imgExtentions[extention], desc, type], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            const newName = result.insertId + "." + extention;
            caller(newName);
        }
    });
}

function photoExists(id, caller) {
    // TOOD: delete
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.photos + " WHERE PHOTO_ID = ?";
    connection.query(sql, [id], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(rows[0].RESULT > 0);
        }
    });
}

function getPhoto(id, caller) {
    const sql = "SELECT * FROM " + tables.photos + " WHERE PHOTO_ID = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
        } else if(result !== undefined && result.length > 0) {
            result[0].UPLOAD_DATE = result[0].UPLOAD_DATE.toString();
            caller(result[0]);
        }
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
    const sql = "SELECT c.*, u.USER_ID, u.USERNAME, u.P_IMG FROM "
    + tables.comments + " c LEFT JOIN Users u ON c.COMMENTER = u.USER_ID WHERE c.PHOTO_ID = ?";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            return;
        }
        caller(results);
    });
}

function addComment(authorId, comment, imageId, caller) {
    const sql = "INSERT INTO " + tables.comments + " (COMMENTER, PHOTO_ID, COMMENT) VALUES (?, ?, ?)";
    connection.query(sql, [authorId, comment, imageId], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(result.insertId);
        }
    });
}


module.exports = {
    addUser: addUser,
    getIdByUsername: getIdByUsername,
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    checkPassword2: checkPassword2,
    getUser: getUser,
    addPhoto: addPhoto,
    photoExists: photoExists,
    getPhoto: getPhoto,
    countLikes: countLikes,
    getLikes: getLikes,
    countComments: countComments,
    getComments: getComments,
    addComment: addComment
};
