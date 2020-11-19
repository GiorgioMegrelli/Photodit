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

const imgExtentionsIndex = ["", "PNG", "GIF", "JPG"];

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
    const sql = "INSERT INTO " + tables.users + " (USERNAME, USERNAME_UPPER, PASSWORD) VALUES (?, ?, ?)";
    const username = uname.trim();
    const usernameUpper = username.toUpperCase();
    const hashpass = hash(password.trim());
    connection.query(sql, [username, usernameUpper, hashpass], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            caller(result.insertId);
        }
    });
}

function getIdByUsername(uname, caller) {
    const sql = "SELECT USER_ID FROM " + tables.users + " WHERE USERNAME_UPPER = ?";
    const username = uname.trim().toUpperCase();
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
        if(result === undefined) {
            result = -1;
        }
        caller(result > 0);
    });
}

/*
    This function must be called only after checkUsername
*/
function checkPassword(uname, password, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.users + " WHERE USERNAME_UPPER = ? AND PASSWORD = ?";
    const username = uname.trim().toUpperCase();
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
    const sql = "INSERT INTO " + tables.photos + " (AUTHOR_ID, FMT_ID, DESCRIPTION, TYPE_ID) VALUES (?, ?, ?, ?)";

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

function getPhoto(id, caller) {
    const sql = "SELECT p.*, u.USERNAME FROM "
    + tables.photos + " p LEFT JOIN " + tables.users
    + " u ON p.AUTHOR_ID = u.USER_ID WHERE PHOTO_ID = ?";
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
    const sql = "SELECT c.*, u.USER_ID, u.USERNAME, u.P_IMG, u.CREATE_DATE FROM "
    + tables.comments + " c LEFT JOIN " + tables.users
    + " u ON c.COMMENTER = u.USER_ID WHERE c.PHOTO_ID = ? ORDER BY c.COMMENT_DATE DESC";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            return;
        }
        caller(results);
    });
}

function addComment(authorId, imageId, comment, caller) {
    const sql = "INSERT INTO " + tables.comments + " (COMMENTER, PHOTO_ID, COMMENT) VALUES (?, ?, ?)";
    connection.query(sql, [authorId, imageId, comment], function(err, result) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(result.insertId);
        }
    });
}

function deleteComment(commentId, caller) {
    const sql = "DELETE FROM " + tables.comments + " WHERE COMMENT_ID = ?";
    connection.query(sql, [commentId], function(err, result) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(result.insertId);
        }
    });
}

function isFollower(follower, followed, caller) {

}


module.exports = {
    addUser: addUser,
    getIdByUsername: getIdByUsername,
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    getUser: getUser,
    addPhoto: addPhoto,
    getPhoto: getPhoto,
    countLikes: countLikes,
    getLikes: getLikes,
    countComments: countComments,
    getComments: getComments,
    addComment: addComment,
    deleteComment: deleteComment,
    isFollower: isFollower
};
