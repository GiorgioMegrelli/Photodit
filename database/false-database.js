const path = require("path");


// Don't change these indexes
let FD_USER_INDEX = 10**7 + 1;
let FD_PHOTO_INDEX = 10**7 + 1;
let FD_COMMENT_INDEX = 10**7 + 1;
let userstable = [];
let photostable = [];
let followerstable = [];
let likestable = [];
let commentstable = [];


const imgExtentions = {
    PNG: 1,
    GIF: 2,
    JPG: 3,
    JPEG: 3
};
const visibilities = {
    PUBLIC: 1,
    PROTECTED: 2,
    PRIVATE: 3
};


function trimNotNull(str) {
    if(str === null || str === undefined) {
        return null;
    }
    str = str.trim();
    return (str.length == 0)? null: str;
}

function today() {
    return new Date().toString();
}

class User {
    constructor(USERNAME, PASSWORD, EMAIL = null, FNAME = null, LNAME = null, STATUS = null) {
        this.USER_ID = FD_USER_INDEX++;
        this.USERNAME = USERNAME.trim();
        this.PASSWORD = PASSWORD.trim();
        this.EMAIL = trimNotNull(EMAIL);
        this.FNAME = trimNotNull(FNAME);
        this.LNAME = trimNotNull(LNAME);
        this.STATUS = trimNotNull(STATUS);
        this.CREATE_DATE = today();
    }
}

class Photo {
    constructor(AUTHOR_ID, FMT_ID, TYPE_ID, DESCRIPTION = "") {
        this.PHOTO_ID = FD_PHOTO_INDEX++;
        this.AUTHOR_ID = AUTHOR_ID;
        this.FMT_ID = FMT_ID;
        this.DESCRIPTION = DESCRIPTION.trim();
        this.TYPE_ID = TYPE_ID;
        this.UPLOAD_DATE = today();
    }
}

class Following {
    constructor(FOLLOWER, FOLLOWING) {
        this.FOLLOWER = FOLLOWER;
        this.FOLLOWING = FOLLOWING;
        this.FOLLOWING_DATE = today();
    }
}

class Like {
    constructor(LIKER, PHOTO_ID) {
        this.LIKER = LIKER;
        this.PHOTO_ID = PHOTO_ID;
        this.LIKE_DATE = today();
    }
}

class Comment {
    constructor(COMMENTER, PHOTO_ID, COMMENT) {
        this.COMMENT_ID = FD_COMMENT_INDEX++;
        this.COMMENTER = COMMENTER;
        this.PHOTO_ID = PHOTO_ID;
        this.COMMENT = trimNotNull(COMMENT);
        this.COMMENT_DATE = today();
    }
}


// Init datatables (arrays)
(function() {
    // Init Users
    [
        ["Bla", new Date(2019, 12, 12, 5, 4, 23, 100), "First User!"],
        ["John", new Date(2020, 5, 20, 7, 20, 33, 100), "Just John"],
        ["admin", new Date(2021, 1, 31, 9, 2, 34, 100), "Admin"]
    ].forEach(function(item) {
        let newUser = new User(item[0], "admin");
        newUser.CREATE_DATE = item[1].toString();
        newUser.STATUS = item[2];
        userstable.push(newUser);
    });

    // Init Images
    let userIds = userstable.map(function(item) {
        return item.USER_ID;
    });
    let id_0 = userIds[0], id_1 = userIds[1], id_2 = userIds[2];
    let JPG = imgExtentions["JPG"], PNG = imgExtentions["PNG"], GIF = imgExtentions["GIF"];

    photostable.push(new Photo(id_0, JPG, visibilities.PUBLIC, "Orangutan"));
    photostable.push(new Photo(id_0, JPG, visibilities.PUBLIC, "Sky"));
    photostable.push(new Photo(id_0, PNG, visibilities.PROTECTED, "Egypt"));
    photostable.push(new Photo(id_1, PNG, visibilities.PUBLIC));
    photostable.push(new Photo(id_1, GIF, visibilities.PRIVATE, "JS Book"));
    photostable.push(new Photo(id_1, JPG, visibilities.PUBLIC, "Bear"));
    photostable.push(new Photo(id_1, JPG, visibilities.PUBLIC, "სელაპი"));
    photostable.push(new Photo(id_1, JPG, visibilities.PROTECTED, ""));
    photostable.push(new Photo(id_2, PNG, visibilities.PUBLIC, "Sky"));
    photostable.push(new Photo(id_2, JPG, visibilities.PROTECTED, ""));

    // Init Followings
    followerstable.push(new Following(id_0, id_1));
    followerstable.push(new Following(id_1, id_0));
    followerstable.push(new Following(id_0, id_2));
    followerstable.push(new Following(id_1, id_2));
    followerstable.push(new Following(id_2, id_1));

    // Init Likes
    let pIds = photostable.map(function(item) {
        return item.PHOTO_ID;
    });

    likestable.push(new Like(id_1, pIds[0]));
    likestable.push(new Like(id_1, pIds[1]));
    likestable.push(new Like(id_1, pIds[2]));

    likestable.push(new Like(id_0, pIds[3]));
    likestable.push(new Like(id_2, pIds[3]));
    likestable.push(new Like(id_0, pIds[5]));
    likestable.push(new Like(id_2, pIds[5]));
    likestable.push(new Like(id_0, pIds[6]));
    likestable.push(new Like(id_2, pIds[6]));
    likestable.push(new Like(id_2, pIds[7]));

    likestable.push(new Like(id_1, pIds[8]));
    likestable.push(new Like(id_1, pIds[9]));

    // Init Comments
    [
        [id_0, pIds[9]], [id_0, pIds[3]],
        [id_2, pIds[8]], [id_0, pIds[0]],
        [id_2, pIds[2]], [id_2, pIds[1]],
        [id_1, pIds[1]], [id_0, pIds[8]],
        [id_2, pIds[9]], [id_0, pIds[8]],
        [id_2, pIds[0]], [id_1, pIds[9]],
        [id_0, pIds[0]], [id_0, pIds[3]],
        [id_1, pIds[5]], [id_0, pIds[0]],
        [id_0, pIds[1]], [id_0, pIds[7]],
        [id_0, pIds[5]], [id_2, pIds[7]],
        [id_0, pIds[8]], [id_0, pIds[7]],
        [id_0, pIds[3]], [id_0, pIds[0]],
        [id_1, pIds[3]], [id_1, pIds[5]],
        [id_2, pIds[3]], [id_0, pIds[6]],
        [id_1, pIds[0]], [id_2, pIds[8]]
    ].forEach(function(item, ind) {
        commentstable.push(new Comment(item[0], item[1], `Test comment ${ind + 1}`));
    });
})();



function addUser(uname, password, caller) {
    let newUser = new User(uname, password);
    userstable.push(newUser);
    caller(newUser.USER_ID);
}

function getIdByUsername(uname, caller) {
    uname = uname.toUpperCase();
    let result = userstable.filter(function(item) {
        return item.USERNAME.toUpperCase() === uname;
    });
    caller((result.length == 0)? -1: result[0].USER_ID);
}

function checkUsername(uname, caller) {
    uname = uname.toUpperCase();
    caller(userstable.some(function(item) {
        return item.USERNAME.toUpperCase() === uname;
    }));
}

function updateProfile(userId, updateParams, caller) {
    getUser(userId, function(result) {
        if(result === undefined) {
            caller(false);
        } else {
            result.EMAIL = trimNotNull(updateParams.new_email);
            result.FNAME = trimNotNull(updateParams.new_fmail);
            result.LNAME = trimNotNull(updateParams.new_lmail);
            result.STATUS = trimNotNull(updateParams.new_status);
            caller(true);
        }
    });
}

/*
    This function must be called only after checkUsername
*/
function checkPassword(uname, password, caller) {
    uname = uname.toUpperCase();
    let result = userstable.filter(function(item) {
        return item.USERNAME.toUpperCase() === uname;
    });
    if(result.length == 0) {
        caller(false);
    } else {
        caller(result[0].PASSWORD === password);
    }
}

function getUser(id, caller) {
    let result = userstable.filter(function(item) {
        return item.USER_ID == id;
    });
    caller((result.length == 0)? undefined: result[0]);
}

function addPhoto(userId, ofilename, desc, type, caller) {
    let ext = path.extname(ofilename).replace(".", "").toUpperCase();
    let newPhoto = new Photo(userId, imgExtentions[ext], type, desc);
    photostable.push(newPhoto);
    caller({id: newPhoto.PHOTO_ID});
}

function getPhoto(id, caller) {
    let result = photostable.filter(function(item) {
        return item.PHOTO_ID == id;
    });
    if(result.length == 0) {
        caller(undefined);
        return;
    }
    getUser(result[0].AUTHOR_ID, function(user) {
        caller(Object.assign({}, result[0], user));
    });
}

function getPhotosOf(id, isfollower, isCurrentUser, caller) {
    let resultList = undefined;
    if(isCurrentUser) {
        resultList = photostable.filter(function(item) {
            return item.AUTHOR_ID == id;
        });
    } else {
        let visibs = [visibilities.PUBLIC];
        if(isfollower) {
            visibs.push(visibilities.PROTECTED);
        }
        resultList = photostable.filter(function(item) {
            return item.AUTHOR_ID == id && visibs.includes(item.TYPE_ID);
        });
    }
    for(let i = 0; i<resultList.length; i++) {
        countLikes(resultList[i].PHOTO_ID, function(cnt) {
            resultList[i].LIKE_NUM = cnt;
        });
    }
    caller(resultList.reverse());
}

function getAllPhotosOf(id, caller) {
    caller(photostable.filter(function(item) {
        return item.AUTHOR_ID == id;
    }).reverse());
}

function getPhotosNumOf(id, isCurrentUser, caller) {
    getPhotosOf(id, true, isCurrentUser, function(result) {
        caller(result.length);
    });
}

function changeVisibility(image_id, vtype, caller) {
    getPhoto(image_id, function(item) {
        if(item === undefined) {
            caller(false);
            return;
        }
        item.TYPE_ID = vtype;
        caller(true);
    });
}

function getLikesOf(id, isCurrentUser, caller) {
    getAllPhotosOf(id, function(results) {
        let visibs = [visibilities.PUBLIC, visibilities.PROTECTED];
        if(isCurrentUser) {
            visibs.push(visibilities.PRIVATE);
        }
        let imgIds = results.filter(function(item) {
            return visibs.includes(item.TYPE_ID);
        }).map(function(item) {
            return item.PHOTO_ID;
        });
        caller(likestable.filter(function(item) {
            return imgIds.includes(item.PHOTO_ID);
        }).length);
    });
}

function getAllLikesOf(id, caller) {
    getLikesOf(id, true, function(results) {
        caller(results.length);
    });
}

function countLikes(id, caller) {
    caller(likestable.filter(function(item) {
        return item.PHOTO_ID == id;
    }).length);
}

function hasLiked(id, userId, caller) {
    caller(likestable.some(function(item) {
        return item.PHOTO_ID == id && item.LIKER == userId;
    }));
}

function sendLike(id, userId, caller) {
    hasLiked(id, userId, function(result) {
        if(!result) {
            likestable.push(new Like(userId, id));
            caller(true);
        } else {
            caller(false);
        }
    });
}

function sendUnlike(id, userId, caller) {
    hasLiked(id, userId, function(result) {
        if(result) {
            let index = -1;
            likestable.forEach(function(item, ind) {
                if(item.PHOTO_ID == id && item.LIKER == userId) {
                    index = ind;
                }
            });
            if(index >= 0) {
                likestable.splice(index, 1);
                caller(true);
            } else {
                caller(false);
            }
        } else {
            caller(false);
        }
    });
}

function getLikes(id, caller) {
    let resultList = [];
    likestable.filter(function(item) {
        return item.PHOTO_ID == id;
    }).reverse().forEach(function(item) {
        getUser(item.LIKER, function(user) {
            if(user !== undefined) {
                resultList.push(Object.assign({}, item, user));
            }
        });
    });
    caller(resultList);
}

function countComments(id, caller) {
    getComments(id, function(results) {
        caller(results.length);
    });
}

function getCommentsOfUser(id, isCurrentUser, caller) {
    getAllPhotosOf(id, function(results) {
        let visibs = [visibilities.PUBLIC, visibilities.PROTECTED];
        if(isCurrentUser) {
            visibs.push(visibilities.PRIVATE);
        }
        let imgIds = results.filter(function(item) {
            return visibs.includes(item.TYPE_ID);
        }).map(function(item) {
            return item.PHOTO_ID;
        });
        caller(commentstable.filter(function(item) {
            return imgIds.includes(item.PHOTO_ID);
        }).length);
    });
}

function getComments(id, caller) {
    let resultList = [];
    commentstable.filter(function(item) {
        return item.PHOTO_ID == id;
    }).reverse().forEach(function(item) {
        getUser(item.COMMENTER, function(user) {
            if(user !== undefined) {
                resultList.push(Object.assign({}, item, user));
            }
        });
    });
    caller(resultList);
}

function addComment(authorId, imageId, comment, caller) {
    let newComment = new Comment(authorId, imageId, comment);
    commentstable.push(newComment);
    caller(newComment.COMMENT_ID);
}

function deleteComment(commentId, caller) {
    let index = -1;
    commentstable.forEach(function(item, ind) {
        if(item.COMMENT_ID == commentId) {
            index = ind;
        }
    });
    if(index >= 0) {
        commentstable.splice(index, 1);
        caller(commentId);
    } else {
        caller(undefined);
    }
}

function isFollower(follower, following, caller) {
    caller(followerstable.some(function(item) {
        return item.FOLLOWER == follower && item.FOLLOWING == following;
    }));
}

function followUser(follower, following, caller) {
    isFollower(follower, following, function(result) {
        if(!result) {
            followerstable.push(new Following(follower, following));
            caller(true);
        } else {
            caller(false);
        }
    });
}

function unfollowUser(follower, following, caller) {
    isFollower(follower, following, function(result) {
        if(result) {
            let index = -1;
            followerstable.forEach(function(item, ind) {
                if(item.FOLLOWER == follower && item.FOLLOWING == following) {
                    index = ind;
                }
            });
            if(index >= 0) {
                followerstable.splice(index, 1);
                caller(true);
            } else {
                caller(false);
            }
        } else {
            caller(false);
        }
    });
}

function getFollowers(id, caller) {
    let results = [];
    followerstable.filter(function(item) {
        return item.FOLLOWING == id;
    }).forEach(function(item) {
        getUser(item.FOLLOWER, function(user) {
            results.push(Object.assign({}, item, user));
        });
    });
    caller(results.reverse());
}

function getFollowings(id, caller) {
    let results = [];
    followerstable.filter(function(item) {
        return item.FOLLOWER == id;
    }).forEach(function(item) {
        getUser(item.FOLLOWING, function(user) {
            results.push(Object.assign({}, item, user));
        });
    });
    caller(results.reverse());
}

function getFollowersNumOf(id, caller) {
    caller(followerstable.filter(function(item) {
        return item.FOLLOWING == id;
    }).length);
}

function getFollowingsNumOf(id, caller) {
    caller(followerstable.filter(function(item) {
        return item.FOLLOWER == id;
    }).length);
}

function searchByUsernames(substr, caller) {
    let regexp = new RegExp(substr, "i");
    caller(userstable.filter(function(item) {
        return regexp.test(item.USERNAME);
    }).map(function(item) {
        item.user_id = item.USER_ID;
        item.username = item.USERNAME;
        return item;
    }));
}

function searchByPhotoDescs(substr, caller) {
    let regexp = new RegExp(substr, "i");
    caller(photostable.filter(function(item) {
        return regexp.test(item.DESCRIPTION);
    }));
}

function searchByComments(substr, caller) {
    let regexp = new RegExp(substr, "i");
    caller(commentstable.filter(function(item) {
        return regexp.test(item.COMMENT);
    }));
}

function deleteImgLikes(image_id, caller) {
    let indexes = [];
    likestable.forEach(function(item, ind) {
        if(item.PHOTO_ID == image_id) {
            indexes.push(ind);
        }
    });
    for(let i = indexes.length - 1; i>=0; i--) {
        likestable.splice(indexes[i], 1);
    }
    caller(true);
}

function deleteImgComments(image_id, caller) {
    let indexes = [];
    commentstable.forEach(function(item, ind) {
        if(item.PHOTO_ID == image_id) {
            indexes.push(ind);
        }
    });
    for(let i = indexes.length - 1; i>=0; i--) {
        commentstable.splice(indexes[i], 1);
    }
    caller(true);
}

function deleteImage(image_id, caller) {
    let index = -1;
    photostable.forEach(function(item, ind) {
        if(item.PHOTO_ID == image_id) {
            index = ind;
        }
    });
    if(index >= 0) {
        photostable.splice(index, 1);
    }
    caller(true);
}


module.exports = {
    databaseIsReal: false,
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
    // Get number of all Comments of User
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
