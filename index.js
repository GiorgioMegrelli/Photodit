const fs = require("fs");
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const multer = require("multer");
const _database = require("./database/database");

// Port ID
const PORT_ID = process.env.PORT || 8089;

const destination = "upload/";

const imgExtentionsIndex = ["", "PNG", "GIF", "JPG"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const BACK_COLORS = [
    "000080", "00008B", "0000CD", "0000FF", "006400", "008000", "008080", "008B8B", "191970", "1E90FF", "20B2AA", "228B22", "2E8B57", "2F4F4F", "32CD32", "3CB371", "4169E1",
    "4682B4", "483D8B", "48D1CC", "4B0082", "556B2F", "5F9EA0", "6495ED", "66CDAA", "696969", "6A5ACD", "6B8E23", "708090", "778899", "7B68EE", "800000", "800080", "808000",
    "808080", "87CEEB", "87CEFA", "8A2BE2", "8B0000", "8B008B", "8B4513", "8FBC8F", "9370D8", "9400D3", "9932CC", "9ACD32", "A0522D", "A52A2A", "A9A9A9", "ADD8E6", "B0C4DE",
    "B22222", "B8860B", "BA55D3", "BC8F8F", "BDB76B", "C0C0C0", "C71585", "CD5C5C", "CD853F", "D2691E", "D2B48C", "D87093", "D8BFD8", "DA70D6", "DAA520", "DC143C", "DDA0DD",
    "DEB887", "E9967A", "EE82EE", "F08080", "F4A460", "FF0000", "FF00FF", "FF1493", "FF4500", "FF6347", "FF69B4", "FF7F50", "FF8C00", "FFA07A", "FFA500", "FFB6C1", "FFD700"
];
const BACK_COLORS_LEN = BACK_COLORS.length;


const app = express();
const upload = multer({
    dest: destination
});


app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));
app.use("/upload", express.static(__dirname + "/upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "3.14159265359", saveUninitialized: true, resave: true}));


_database(function(database) {

    app.post("/isDatabaseReal", function(request, response) {
        response.send(database.databaseIsReal);
    });

    app.get("favicon.ico", function(request, response) {
        response.sendFile("./public/images/favicon.png");
    });

    app.get(["/", "/index", "/index.html"], function(request, response) {
        response.render("index");
    });

    app.post("/login-check", function(request, response) {
        const username = request.body.uname;
        const password = request.body.password;
        if(username === undefined || password === undefined) {
            response.send("-1");// Internal Server Error
        } else {
            database.checkUsername(username, function(result) {
                if(!result) {
                    response.send("2"); // Incorrect Username or Password
                } else {
                    database.checkPassword(username, password, function(result2) {
                        if(!result2) {
                            response.send("1"); // Incorrect Password
                        } else {
                            response.send("0"); // Correct
                        }
                    });
                }
            });
        }
    });

    app.post("/login", function(request, response) {
        const username = request.body.uname.trim();
        database.getIdByUsername(username, function(result) {
            if(result === undefined || result == -1) {
                response.redirect("/");
            } else {
                request.session.thisUserId = result;
                response.redirect("/profile");
            }
        });
    });

    app.post("/register-check", function(request, response) {
        const username = request.body.uname;
        if(username === undefined) {
            response.send("-1");// Internal Server Error
        } else {
            database.checkUsername(username, function(result) {
                if(result) {
                    response.send("1"); // Username Already Exists
                } else {
                    response.send("0"); // Correct
                }
            });
        }
    });

    app.post("/register", function(request, response) {
        const username = request.body.uname.trim();
        const password = request.body.password.trim();
        database.addUser(username, password, function(result) {
            if(result === undefined || result < 0) {
                response.redirect("/");
            } else {
                request.session.thisUserId = result;
                response.redirect("/profile");
            }
        });
    });

    app.post("/logout", function(request, response) {
        request.session.thisUserId = undefined;
        response.redirect("/");
    });

    app.get("/profile", function(request, response) {
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        database.getUser(currentUser, function(result) {
            if(result === undefined) {
                response.redirect("/");
            } else {
                result.FULLNAME = null;
                let arr = [];
                if(result.LNAME !== null) {
                    arr.push(result.LNAME);
                }
                if(result.FNAME !== null) {
                    arr.push(result.FNAME);
                }
                if(arr.length > 0) {
                    result.FULLNAME = arr.join(", ");
                }
                result.background = createImg(result.CREATE_DATE.toString());
                response.render("profile", result);
            }
        });
    });

    app.post("/updateProfile", function(request, response) {
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        database.updateProfile(currentUser, request.body, function() {
            response.redirect("/profile");
        });
    });

    app.post("/upload", upload.single("imgpath"), function(request, response) {
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        const originName = request.file.originalname;
        const filePath = request.file.path;
        const visiType = parseInt(request.body.visiType);
        const desc = request.body.desc;
        database.addPhoto(currentUser, originName, desc, visiType, function(result) {
            if(result === undefined) {
                response.redirect("/profile");
                return;
            }
            fs.rename(filePath, destination + result.filename, function(err) {
                if(err) {
                    console.log(err);
                }
                response.redirect("/image/" + result.id);
            });
        });
    });

    app.get("/user/:userId", function(request, response) {
        let userId = request.params.userId;
        let currentUser = request.session.thisUserId;
        if(currentUser == undefined) {
            response.redirect("/");
        } else if(userId == currentUser) {
            response.redirect("/profile");
        } else {
            database.getUser(userId, function(result) {
                if(result === undefined) {
                    response.redirect("/profile");
                } else {
                    database.isFollower(currentUser, userId, function(isFollower) {
                        result.FULLNAME = null;
                        let arr = [];
                        if(result.LNAME !== null) {
                            arr.push(result.LNAME);
                        }
                        if(result.FNAME !== null) {
                            arr.push(result.FNAME);
                        }
                        if(arr.length > 0) {
                            result.FULLNAME = arr.join(", ");
                        }
                        result.FULLNAME_CNT = 0;
                        if(result.FULLNAME !== null) {
                            result.FULLNAME_CNT++;
                        }
                        if(result.EMAIL !== null) {
                            result.FULLNAME_CNT++;
                        }
                        result.isFollower = isFollower;
                        result.background = createImg(result.CREATE_DATE.toString());
                        response.render("user", result);
                    });
                }
            });
        }
    });

    app.post("/getFullNumbersPLC", function(request, response) {
        let userId = request.body.userId;
        let currentUser = request.session.thisUserId;
        let isCurrentUser = false;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(userId == -1) {
            userId = currentUser;
            isCurrentUser = true;
        }
        database.getLikesOf(userId, isCurrentUser, function(likeNum) {
            database.getCommentsOfUser(userId, isCurrentUser, function(comNum) {
                database.getPhotosNumOf(userId, isCurrentUser, function(imgNum) {
                    response.send({
                        imageNum: imgNum,
                        likeNum: likeNum,
                        commentNum: comNum
                    });
                });
            });
        });
    });

    app.post("/getFullNumbersFF", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(userId === undefined || isNaN(userId)) {
            response.redirect("/profile");
            return;
        }
        if(userId == -1) {
            userId = currentUser;
        }
        database.getFollowersNumOf(userId, function(followers) {
            database.getFollowingsNumOf(userId, function(followings) {
                response.send({
                    followingsNum: followings,
                    followersNum: followers
                });
            });
        });
    });

    app.post("/getFollowers", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.send(null);
            return;
        }
        if(userId == -1) {
            userId = currentUser;
        }
        database.getFollowers(userId, function(results) {
            response.send(results);
        });
    });

    app.post("/getFollowings", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.send(null);
            return;
        }
        if(userId == -1) {
            userId = currentUser;
        }
        database.getFollowings(userId, function(results) {
            response.send(results);
        });
    });

    app.post("/followUser", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        if(currentUser === undefined || currentUser == userId) {
            response.redirect("/");
            return;
        }
        if(userId === undefined || isNaN(userId) || userId == -1) {
            response.redirect("/profile");
            return;
        }
        database.isFollower(currentUser, userId, function(isfollower) {
            if(isfollower) {
                database.unfollowUser(currentUser, userId, function(result) {
                    if(result) {
                        response.send({result: result, type: -1});
                    } else {
                        response.redirect("/profile");
                    }
                });
            } else {
                database.followUser(currentUser, userId, function(result) {
                    if(result) {
                        response.send({result: result, type: 1});
                    } else {
                        response.redirect("/profile");
                    }
                });
            }
        });
    });

    app.post("/getPhotos", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        let isCurrentUser = false;
        if(currentUser === undefined || currentUser == userId) {
            response.redirect("/");
            return;
        }
        if(userId === undefined || isNaN(userId)) {
            response.redirect("/profile");
            return;
        }
        if(userId == -1) {
            userId = currentUser;
            isCurrentUser = true;
        }
        database.isFollower(currentUser, userId, function(isfollower) {
            database.getPhotosOf(userId, isfollower, isCurrentUser, function(result) {
                if(result !== undefined) {
                    for(let i = 0; i<result.length; i++) {
                        result[i].src = toImageFullPath(result[i].PHOTO_ID, result[i].FMT_ID);
                    }
                    response.send(result);
                }
            });
        });
    });

    app.post("/getAllPhotos", function(request, response) {
        let userId = parseInt(request.body.userId);
        let currentUser = request.session.thisUserId;
        if(currentUser === undefined || currentUser == userId) {
            response.redirect("/");
            return;
        }
        if(userId === undefined || isNaN(userId) || userId == -1) {
            response.redirect("/profile");
            return;
        }
        database.getAllPhotosOf(currentUser, function(results) {
            response.send(results);
        });
    });

    app.get("/image/:imageId", function(request, response) {
        const imageId = parseInt(request.params.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        const rtypes = {
            RETURN_ERR: -1,
            RETURN_FALSE: 0,
            RETURN_TRUE: 1
        };
        let returnVal = {};
        returnVal.title = "";
        returnVal.msg = "";
        if(isNaN(imageId) || imageId == -1) {
            returnVal.rtype = rtypes.RETURN_ERR;
            returnVal.msg = "Invalid URL of Image";
            returnVal.title = returnVal.msg;
            returnVal.vars = rtypes;
            response.render("image", returnVal);
        } else {
            const visibilities = {
                PUBLIC: 1,
                PROTECTED: 2,
                PRIVATE: 3
            };
            returnVal.vars = Object.assign(rtypes, visibilities);
            database.getPhoto(imageId, function(result) {
                if(result === undefined) {
                    returnVal.rtype = rtypes.RETURN_FALSE;
                    returnVal.msg = "Image with this ID: " + imageId + " - doesn't Exist";
                    returnVal.title = returnVal.msg;
                    response.render("image", returnVal);
                } else {
                    const typeId = result.TYPE_ID;
                    returnVal.vtypeId = typeId;
                    returnVal.rtype = rtypes.RETURN_TRUE;
                    returnVal.isAuthor = (result.AUTHOR_ID == currentUser);
                    result.UPLOAD_DATE = formatDate(result.UPLOAD_DATE);
                    if(returnVal.isAuthor || typeId == visibilities.PUBLIC) {
                        returnVal.title = result.DESCRIPTION;
                        returnVal.desc = result.DESCRIPTION;
                        returnVal.src = toImageFullPath(result.PHOTO_ID, result.FMT_ID);
                        if(returnVal.isAuthor) {
                            returnVal.userHref = "/profile";
                        } else {
                            returnVal.userHref = "/user/" + result.AUTHOR_ID;
                        }
                        returnVal.username = result.USERNAME;
                        returnVal.uploaddate = result.UPLOAD_DATE;
                        response.render("image", returnVal);
                    } else if(typeId == visibilities.PRIVATE) {
                        returnVal.rtype = rtypes.RETURN_FALSE;
                        returnVal.msg = "Only Author of the Image can see this photo";
                        returnVal.title = returnVal.msg;
                        response.render("image", returnVal);
                    } else {
                        database.isFollower(currentUser, result.AUTHOR_ID, function(isfollower) {
                            if(!isfollower) {
                                returnVal.rtype = rtypes.RETURN_FALSE;
                                returnVal.msg = "Only Subscribers of this Author can see this photo";
                                returnVal.title = returnVal.msg;
                                returnVal.username = result.USERNAME;
                            } else {
                                returnVal.title = result.DESCRIPTION;
                                returnVal.desc = result.DESCRIPTION;
                                returnVal.src = toImageFullPath(result.PHOTO_ID, result.FMT_ID);
                                returnVal.userHref = "/user/" + result.AUTHOR_ID;
                                returnVal.username = result.USERNAME;
                                returnVal.uploaddate = result.UPLOAD_DATE;
                            }
                            response.render("image", returnVal);
                        });
                    }
                }
            });
        }
    });

    app.post("/changeVisibility", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const vtypeId = request.body.vtypeId;
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.changeVisibility(imageId, vtypeId, function(result) {
            response.send({result: result});
        });
    });

    app.post("/deleteImage", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.deleteImgLikes(imageId, function(result1) {
            if(result1) {
                database.deleteImgComments(imageId, function(result2) {
                    if(result2) {
                        database.deleteImage(imageId, function(result3) {
                            if(result3) {
                                response.redirect("/profile");
                            } else {
                                response.redirect("/image/" + imageId);
                            }
                        });
                    } else {
                        response.redirect("/image/" + imageId);
                    }
                });
            } else {
                response.redirect("/image/" + imageId);
            }
        });
    });

    app.post("/loadComments", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.getComments(imageId, function(results) {
            if(results === undefined) {
                response.redirect("/profile");
                return;
            }
            for(let i = 0; i<results.length; i++) {
                results[i].COMMENT_DATE = results[i].COMMENT_DATE.toString();
                results[i].IS_AUTHOR = (results[i].USER_ID == currentUser);
                results[i].ENCRYPT_ID = encrypt(results[i].COMMENT_ID.toString());
                if(results[i].P_IMG == null) {
                    results[i].BACK_COLOR = createImg(results[i].CREATE_DATE.toString());
                }
                delete results[i].CREATE_DATE;
                delete results[i].COMMENT_ID;
            }
            response.send(JSON.stringify(results));
        });
    });

    app.post("/addComment", function(request, response) {
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        const comment = request.body.comment;
        const imageId = request.body.imageId;
        if(imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.addComment(currentUser, imageId, comment, function(result) {
            response.send({result: (result !== undefined)});
        });
    });

    app.post("/deleteComment", function(request, response) {
        const encyptedId = request.body.encyptedId;
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        let id = parseInt(decrypt(encyptedId).trim());
        database.deleteComment(id, function(result) {
            response.send({result: (result !== undefined)});
        });
    });

    app.post("/countLikes", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.countLikes(imageId, function(count) {
            database.hasLiked(imageId, currentUser, function(liked) {
                response.send({
                    count: count,
                    hasLiked: liked
                });
            });
        });
    });

    app.post("/getLikes", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.getLikes(imageId, function(results) {
            if(results === undefined) {
                response.redirect("/profile");
                return;
            }
            response.send(results);
        });
    });

    app.post("/like", function(request, response) {
        const imageId = parseInt(request.body.imageId);
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        if(imageId === undefined || isNaN(imageId) || imageId == -1) {
            response.redirect("/profile");
            return;
        }
        database.hasLiked(imageId, currentUser, function(liked) {
            if(liked) {
                database.sendUnlike(imageId, currentUser, function(result) {
                    response.send((result)? "-1": "0");
                });
            } else {
                database.sendLike(imageId, currentUser, function(result) {
                    response.send((result)? "1": "0");
                });
            }
        });
    });

    app.get("/search", function(request, response) {
        const searchStr = request.query.search;
        const currentUser = request.session.thisUserId;
        if(currentUser === undefined) {
            response.redirect("/");
            return;
        }
        database.searchByUsernames(searchStr, function(results1) {
            if(results1 === undefined) {
                results1 = [];
            }
            for(let i = 0; i<results1.length; i++) {
                results1[i].P_IMG = createImg(results1[i].CREATE_DATE);
            }
            database.searchByPhotoDescs(searchStr, function(results2) {
                if(results2 === undefined) {
                    results2 = [];
                }
                database.searchByComments(searchStr, function(results3) {
                    if(results3 === undefined) {
                        results3 = [];
                    }
                    let fullResults = {
                        searchStr: searchStr,
                        usernames: results1,
                        usernamesLen: results1.length,
                        descriptions: results2,
                        descriptionsLen: results2.length,
                        comments: results3,
                        commentsLen: results3.length
                    };
                    response.render("search", fullResults);
                });
            });
        });
    });


    app.listen(PORT_ID, function() {
        console.log("Listens at Port: ", PORT_ID);
    });

});


/**
    Helper Functions
*/
function createImg(dateStr) {
    let date = Date.parse(dateStr);
    let randIndex = date%BACK_COLORS_LEN;
    return "#" + BACK_COLORS[randIndex];
}

function formatDate(time) {
    time = new Date(Date.parse(time));
    let str = time.getDate() + " ";
    str += months[time.getMonth()] + " ";
    str += time.getFullYear() + "  ";
    str += time.getHours() + ":";
    str += time.getMinutes() + ":";
    str += time.getSeconds();
    return str;
}

function toImageFullPath(photoId, fmtId) {
    return ("../" + destination + (photoId + "." + imgExtentionsIndex[fmtId]));
}

/* My "Encrypting" and "Decrypting" */
function randomString() {
    let length = 5 + Math.floor(Math.random()*4);
    let str = "";
    for(let i = 0; i<length; i++) {
        str += (1 + Math.floor(Math.random()*9)).toString();
    }
    return str;
}

function encrypt(text){
    let left = randomString();
    let right = randomString();
    return [left, text, right].join("0");
}

function decrypt(text){
    const length = text.length;
    let leftIndex, rightIndex;
    for(let i = 0; i<length; i++) {
        if(text.charAt(i) === "0") {
            leftIndex = i;
            break;
        }
    }
    for(let i = length - 1; i>=0; i--) {
        if(text.charAt(i) === "0") {
            rightIndex = i;
            break;
        }
    }
    return text.substring(leftIndex + 1, rightIndex);
}
