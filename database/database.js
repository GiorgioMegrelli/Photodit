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

const visibilities = {
    "PUBLIC": 1,
    "PROTECTED": 2,
    "PRIVATE": 3
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
        } else {
            result[0].CREATE_DATE = result[0].CREATE_DATE.toString();
            delete result[0].PASSWORD;
            delete result[0].USERNAME_UPPER;
            caller(result[0]);
        }
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

function getPhotosOf(id, caller) {
    const sql = "SELECT PHOTO_ID, FMT_ID FROM " + tables.photos
    + " WHERE AUTHOR_ID = ? AND (TYPE_ID = ? OR TYPE_ID = ?) ORDER BY UPLOAD_DATE DESC";
    connection.query(sql, [id, visibilities.PUBLIC, visibilities.PROTECTED], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            caller(result);
        }
    });
}

function getLikesOf(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM "
    + tables.likes + " l LEFT JOIN " + tables.photos
    + " p ON l.PHOTO_ID = p.PHOTO_ID WHERE p.AUTHOR_ID = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
            caller(0);
        } else {
            caller(result[0].RESULT);
        }
    });
}

function getCommentsOf(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM "
    + tables.comments + " c LEFT JOIN " + tables.photos
    + " p ON c.PHOTO_ID = p.PHOTO_ID WHERE p.AUTHOR_ID = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
            caller(0);
        } else {
            caller(result[0].RESULT);
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

function hasLiked(id, userId, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM "
    + tables.likes + " WHERE PHOTO_ID = ? AND LIKER = ?";
    connection.query(sql, [id, userId], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(rows[0].RESULT > 0);
    });
}

function sendLike(id, userId, caller) {
    const sql = "INSERT INTO " + tables.likes + " (LIKER, PHOTO_ID) VALUES (?, ?)";
    connection.query(sql, [userId, id], function(err, rows) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(true);
    });
}

function sendUnlike(id, userId, caller) {
    const sql = "DELETE FROM " + tables.likes + " WHERE LIKER = ? AND PHOTO_ID = ?";
    connection.query(sql, [userId, id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(true);
    });
}

function getLikes(id, caller) {
    const sql = "SELECT u.USER_ID, u.USERNAME, l.* FROM "
    + tables.likes + " l LEFT JOIN " + tables.users
    + " u ON l.LIKER = u.USER_ID WHERE l.PHOTO_ID = ? ORDER BY l.LIKE_DATE DESC";
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
    const sql = "SELECT c.*, u.USER_ID, u.USERNAME, u.CREATE_DATE FROM "
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

function isFollower(follower, following, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.followings + " WHERE FOLLOWER = ? AND FOLLOWING = ?";
    connection.query(sql, [follower, following], function(err, result) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(result[0].RESULT > 0);
        }
    });
}

function followUser(follower, following, caller) {
    const sql = "INSERT INTO " + tables.followings + " (FOLLOWER, FOLLOWING) VALUES (?, ?)";
    connection.query(sql, [follower, following], function(err, result) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function unfollowUser(follower, following, caller) {
    const sql = "DELETE FROM " + tables.followings + " WHERE FOLLOWER = ? AND FOLLOWING = ?";
    connection.query(sql, [follower, following], function(err, result) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function getFollowers(id, caller) {
    const sql = "SELECT f.FOLLOWER AS ID, u.USERNAME FROM " + tables.followings
    + " f LEFT JOIN " + tables.users + " u ON f.FOLLOWER = u.USER_ID WHERE f.FOLLOWING = ?";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(results);
        }
    });
}

function getFollowings(id, caller) {
    const sql = "SELECT f.FOLLOWING AS ID, u.USERNAME FROM " + tables.followings
    + " f LEFT JOIN " + tables.users + " u ON f.FOLLOWING = u.USER_ID WHERE f.FOLLOWER = ?";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(results);
        }
    });
}

function getFollowersNumOf(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.followings + " WHERE FOLLOWING = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            caller(result[0].RESULT);
        }
    });
}

function getFollowingsNumOf(id, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.followings + " WHERE FOLLOWER = ?";
    connection.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
        } else {
            caller(result[0].RESULT);
        }
    });
}

function searchByUsernames(substr, caller) {
    const sql = "SELECT USER_ID, USERNAME FROM " + tables.users + " WHERE USERNAME LIKE ?";
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(results);
        }
    });
}

function searchByPhotoDescs(substr, caller) {
    const sql = "SELECT PHOTO_ID, AUTHOR_ID, DESCRIPTION FROM " + tables.photos + " WHERE DESCRIPTION LIKE ?";
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(results);
        }
    });
}

function searchByComments(substr, caller) {
    const sql = "SELECT PHOTO_ID, COMMENT FROM " + tables.comments + " WHERE COMMENT LIKE ?";
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            caller(results);
        }
    });
}


module.exports = {
    addUser: addUser,
    getIdByUsername: getIdByUsername,
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    getUser: getUser,
    addPhoto: addPhoto,
    getPhoto: getPhoto,
    getPhotosOf: getPhotosOf,
    getLikesOf: getLikesOf,
    getCommentsOf: getCommentsOf,
    countLikes: countLikes,
    hasLiked: hasLiked,
    sendLike: sendLike,
    sendUnlike: sendUnlike,
    getLikes: getLikes,
    countComments: countComments,
    getComments: getComments,
    addComment: addComment,
    deleteComment: deleteComment,
    isFollower: isFollower,
    followUser: followUser,
    unfollowUser: unfollowUser,
    getFollowers: getFollowers,
    getFollowings: getFollowings,
    getFollowersNumOf: getFollowersNumOf,
    getFollowingsNumOf: getFollowingsNumOf,
    searchByUsernames: searchByUsernames,
    searchByPhotoDescs: searchByPhotoDescs,
    searchByComments: searchByComments
};
