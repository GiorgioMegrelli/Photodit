const mysql = require("mysql");
const crypto = require("crypto");
const path = require("path");
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
            caller(undefined);
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
            caller(undefined);
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

function updateProfile(userId, updateParams, caller) {
    const sql = "UPDATE " + tables.users
    + " SET EMAIL = ?, FNAME = ?, LNAME = ?, STATUS = ? WHERE USER_ID = ?";
    let params = [
        updateParams.new_email,
        updateParams.new_fmail,
        updateParams.new_lmail,
        updateParams.new_status,
        userId
    ];
    connection.query(sql, params, function(err) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(true);
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
            caller(undefined);
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
    const extention = path.extname(ofilename).replace(".", "").toUpperCase();
    connection.query(sql, [userId, imgExtentions[extention], desc, type], function(err, result) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller({
                id: result.insertId,
                filename: result.insertId + "." + extention
            });
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
            caller(undefined);
        } else if(result !== undefined && result.length > 0) {
            result[0].UPLOAD_DATE = result[0].UPLOAD_DATE.toString();
            caller(result[0]);
        } else {
            caller(undefined);
        }
    });
}

function getPhotosOf(id, isfollower, isCurrentUser, caller) {
    const sql = [
        "SELECT p.*, COUNT(l.liker) AS LIKE_NUM FROM ",
        tables.photos,
        " p LEFT JOIN ",
        tables.likes,
        " l ON p.PHOTO_ID = l.PHOTO_ID ",
        "WHERE p.AUTHOR_ID = ? ",
        (isCurrentUser)? "":"AND (p.TYPE_ID = ? OR p.TYPE_ID = ?) ",
        "GROUP BY p.PHOTO_ID ",
        "ORDER BY UPLOAD_DATE DESC"
    ].join("");
    const params = [id, visibilities.PUBLIC, (isfollower)? visibilities.PROTECTED: null];
    connection.query(sql, params, function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(results);
        }
    });
}

function getAllPhotosOf(id, caller) {
    const sql = [
        "SELECT p.*, COUNT(l.liker) AS LIKE_NUM FROM ",
        tables.photos,
        " p LEFT JOIN ",
        tables.likes,
        " l ON p.PHOTO_ID = l.PHOTO_ID WHERE p.AUTHOR_ID = ? ",
        "GROUP BY p.PHOTO_ID ORDER BY UPLOAD_DATE DESC"
    ].join("");
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(results);
        }
    });
}

function getPhotosNumOf(id, isCurrentUser, caller) {
    const sql = "SELECT COUNT(*) AS RESULT FROM " + tables.photos
    + " WHERE AUTHOR_ID = ?" + ((isCurrentUser)? "": " AND (TYPE_ID = ? OR TYPE_ID = ?)");
    const params = [id, visibilities.PUBLIC,  visibilities.PROTECTED];
    connection.query(sql, params, function(err, results) {
        if(err) {
            console.log(err);
            caller(0);
        } else {
            caller(results[0].RESULT);
        }
    });
}

function changeVisibility(image_id, vtype, caller) {
    const sql = "UPDATE " + tables.photos + " SET TYPE_ID = ? WHERE PHOTO_ID = ?";
    connection.query(sql, [vtype, image_id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function getLikesOf(id, isCurrentUser, caller) {
    const sql = [
        "SELECT COUNT(*) AS RESULT FROM ",
        tables.likes,
        " l LEFT JOIN ",
        tables.photos,
        " p ON l.PHOTO_ID = p.PHOTO_ID WHERE p.AUTHOR_ID = ?",
        (isCurrentUser)? "":" AND (p.TYPE_ID = ? OR p.TYPE_ID = ?)"
    ].join("");
    const params = [id, visibilities.PUBLIC,  visibilities.PROTECTED];
    connection.query(sql, params, function(err, result) {
        if(err) {
            console.log(err);
            caller(0);
        } else {
            caller(result[0].RESULT);
        }
    });
}

function getAllLikesOf(id, caller) {
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

function getCommentsOfUser(id, isCurrentUser, caller) {
    const sql = [
        "SELECT COUNT(*) AS RESULT FROM ",
        tables.comments,
        " c LEFT JOIN ",
        tables.photos,
        " p ON c.PHOTO_ID = p.PHOTO_ID WHERE p.AUTHOR_ID = ?",
        (isCurrentUser)? "":" AND (p.TYPE_ID = ? OR p.TYPE_ID = ?)"
    ].join("");
    const params = [id, visibilities.PUBLIC,  visibilities.PROTECTED];
    connection.query(sql, params, function(err, result) {
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

function _sendLike_Unlike(sql, id, userId, caller) {
    connection.query(sql, [userId, id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
            return;
        }
        caller(true);
    });
}

function sendLike(id, userId, caller) {
    const sql = "INSERT INTO " + tables.likes + " (LIKER, PHOTO_ID) VALUES (?, ?)";
    _sendLike_Unlike(sql, id, userId, function(result) {
        caller(result);
    });
}

function sendUnlike(id, userId, caller) {
    const sql = "DELETE FROM " + tables.likes + " WHERE LIKER = ? AND PHOTO_ID = ?";
    _sendLike_Unlike(sql, id, userId, function(result) {
        caller(result);
    });
}

function getLikes(id, caller) {
    const sql = "SELECT u.USER_ID, u.USERNAME, l.* FROM "
    + tables.likes + " l LEFT JOIN " + tables.users
    + " u ON l.LIKER = u.USER_ID WHERE l.PHOTO_ID = ? ORDER BY l.LIKE_DATE DESC";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
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
            caller(undefined);
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

function _followUser(sql, follower, following, caller) {
    connection.query(sql, [follower, following], function(err) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function followUser(follower, following, caller) {
    const sql = "INSERT INTO " + tables.followings + " (FOLLOWER, FOLLOWING) VALUES (?, ?)";
    _followUser(sql, follower, following, function(result) {
        caller(result);
    });
}

function unfollowUser(follower, following, caller) {
    const sql = "DELETE FROM " + tables.followings + " WHERE FOLLOWER = ? AND FOLLOWING = ?";
    _followUser(sql, follower, following, function(result) {
        caller(result);
    });
}

function getFollowers(id, caller) {
    const sql = "SELECT f.FOLLOWER AS ID, u.USERNAME FROM " + tables.followings
    + " f LEFT JOIN " + tables.users + " u ON f.FOLLOWER = u.USER_ID WHERE f.FOLLOWING = ?";
    connection.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
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
            caller(undefined);
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
            caller(0);
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
            caller(0);
        } else {
            caller(result[0].RESULT);
        }
    });
}

function searchByUsernames(substr, caller) {
    const sql = [
        "SELECT u.username, u.user_id, u.CREATE_DATE",
        "FROM users u",
        "LEFT JOIN (",
            "SELECT p.photo_id AS photoid, p.AUTHOR_ID AS userid, count(l.like_date) AS likenum",
            "FROM photos p",
            "RIGHT JOIN likes l ON p.PHOTO_ID = l.PHOTO_ID",
            "GROUP BY p.photo_id",
        ") sub ON u.user_id = sub.userid",
        "WHERE u.username LIKE ?",
        "ORDER BY sub.likenum DESC"
    ].join(" ");
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(results);
        }
    });
}

function searchByPhotoDescs(substr, caller) {
    const sql = "SELECT PHOTO_ID, DESCRIPTION FROM " + tables.photos + " WHERE DESCRIPTION LIKE ?";
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(results);
        }
    });
}

function searchByComments(substr, caller) {
    const sql = "SELECT PHOTO_ID, COMMENT FROM " + tables.comments
    + " WHERE COMMENT LIKE ? ORDER BY COMMENT_DATE DESC";
    connection.query(sql, ["%" + substr + "%"], function(err, results) {
        if(err) {
            console.log(err);
            caller(undefined);
        } else {
            caller(results);
        }
    });
}

function deleteImgLikes(image_id, caller) {
    const sql = "DELETE FROM " + tables.likes + " WHERE PHOTO_ID = ?";
    connection.query(sql, [image_id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function deleteImgComments(image_id, caller) {
    const sql = "DELETE FROM " + tables.comments + " WHERE PHOTO_ID = ?";
    connection.query(sql, [image_id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}

function deleteImage(image_id, caller) {
    const sql = "DELETE FROM " + tables.photos + " WHERE PHOTO_ID = ?";
    connection.query(sql, [image_id], function(err) {
        if(err) {
            console.log(err);
            caller(false);
        } else {
            caller(true);
        }
    });
}


module.exports = {
     // Add new User
    addUser: addUser,

    // Get User's Id by their Username
    getIdByUsername: getIdByUsername,

    // Check if Username exists
    checkUsername: checkUsername,

    // Update Profile of User
    updateProfile: updateProfile,

    // Check if Password is correct
    checkPassword: checkPassword,

    // Returns information about User
    getUser: getUser,

    // Add Image
    addPhoto: addPhoto,

    // Return information about Image
    getPhoto: getPhoto,

    // Get Public and Protected Images
    getPhotosOf: getPhotosOf,

    // Get Images of all type
    getAllPhotosOf: getAllPhotosOf,

    // Get number of Public and Protected Images
    getPhotosNumOf: getPhotosNumOf,

    // Change visibility of Image
    changeVisibility: changeVisibility,

    // Get number of Likes on Public and Protected Images of User
    getLikesOf: getLikesOf,

    // Get number of Likes on all Images of User
    getAllLikesOf: getAllLikesOf,

    // get number of all Comments of User
    getCommentsOfUser: getCommentsOfUser,

    // Get number of Likes on Image
    countLikes: countLikes,

    // Check if User has Liked the Image
    hasLiked: hasLiked,

    // Likes Image if User has not Liked it yet
    sendLike: sendLike,

    // Unlikes Image if User has Liked it
    sendUnlike: sendUnlike,

    // List of Likes on Image
    getLikes: getLikes,

    // Return number of Comments on Image
    countComments: countComments,

    // Return Comments on Image
    getComments: getComments,

    // Add Comment on Image
    addComment: addComment,

    // Delete Comment on Image
    deleteComment: deleteComment,

    // Check if the User is Follower of other User
    isFollower: isFollower,

    // Follow User if they haven't been Followed yet
    followUser: followUser,

    // Unfollow User if they have been Followed
    unfollowUser: unfollowUser,

    // Get Followers of User
    getFollowers: getFollowers,

    // Get Followings of User
    getFollowings: getFollowings,

    // Get number of Followers of User
    getFollowersNumOf: getFollowersNumOf,

    // Get number of Followings of User
    getFollowingsNumOf: getFollowingsNumOf,

    // Seach by Usernames
    searchByUsernames: searchByUsernames,

    // Seach by Description of Images
    searchByPhotoDescs: searchByPhotoDescs,

    // Seach by Comments on Images
    searchByComments: searchByComments,

    // Delete Likes on Image
    deleteImgLikes: deleteImgLikes,

    // Delete Comments on Image
    deleteImgComments: deleteImgComments,

    // Delete Image
    deleteImage: deleteImage
};
