const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const multer = require("multer");
const database = require("./database/database");


const PORT_ID = 8089;
const destination = "upload/";

const imgExtentionsIndex = ["", "PNG", "GIF", "JPG"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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
        if(result === undefined || result < 0) {
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
        if(result < 0) {
            response.redirect("/");
        } else {
            request.session.thisUserId = result;
            response.redirect("/profile");
        }
    });
});

app.get("/profile", function(request, response) {
    const currentUser = request.session.thisUserId;
    if(currentUser === undefined) {
        response.redirect("/");
    } else {
        //response.render("profile", {});
        //response.sendFile(__dirname + "/views/profile.html");
        // TODO: delete
        response.redirect("/image/1");
    }
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
        fs.renameSync(filePath, destination + result, function(err) {
            if(err) {
                console.log(err);
            }
        });
    });
});

app.get("/user/:userId", function(request, response) {
    const userId = request.params.userId;
    if(userId == request.session.thisUserId) {
        response.redirect("/profile");
    }
    console.log(userId);
});

app.get("/image/:imageId", function(request, response) {
    const currentUser = request.session.thisUserId;
    if(currentUser === undefined) {
        response.redirect("/");
        return;
    }
    const imageId = request.params.imageId;
    const rtypes = {
        RETURN_ERR: -1,
        RETURN_FALSE: 0,
        RETURN_TRUE: 1
    };
    let returnVal = {};
    returnVal.title = "";
    returnVal.msg = "";
    if(isNaN(imageId)) {
        returnVal.rtype = rtypes.RETURN_ERR;
        returnVal.msg = "Invalid URL of Image";
        returnVal.title = returnVal.msg;
        returnVal.vars = rtypes;
        response.render("image", returnVal);
    } else {
        const id = parseInt(imageId);
        const visibilities = {
            PUBLIC: 1,
            PROTECTED: 2,
            PRIVATE: 3
        };
        returnVal.vars = Object.assign(rtypes, visibilities);
        database.getPhoto(id, function(result) {
            if(result === undefined) {
                returnVal.rtype = rtypes.RETURN_FALSE;
                returnVal.msg = "Image with this ID: " + id + " - doesn't Exist";
                returnVal.title = returnVal.msg;
            } else {
                const typeId = result.typeId;
                returnVal.rtype = rtypes.RETURN_TRUE;
                returnVal.isAuthor = (result.AUTHOR_ID == currentUser);
                result.UPLOAD_DATE = formatDate(result.UPLOAD_DATE);
                if(returnVal.isAuthor) {
                    returnVal.title = result.DESCRIPTION;
                    returnVal.src = "../" + destination + (result.PHOTO_ID + "." + imgExtentionsIndex[result.TYPE_ID]);
                    returnVal.userHref = "/profile";
                    returnVal.username = result.USERNAME;
                    returnVal.uploaddate = result.UPLOAD_DATE;
                } else if(typeId == visibilities.PRIVATE) {
                    returnVal.rtype = rtypes.RETURN_FALSE;
                    returnVal.msg = "Only Author of the Image can view it";
                    returnVal.title = returnVal.msg;
                } else {
                    returnVal.title = result.DESCRIPTION;
                    returnVal.src = "../" + destination + (result.PHOTO_ID + "." + imgExtentionsIndex[result.TYPE_ID]);
                    returnVal.userHref = "/user/" + result.AUTHOR_ID;
                    returnVal.username = result.USERNAME;
                    returnVal.uploaddate = result.UPLOAD_DATE;
                }
            }
            response.render("image", returnVal);
        });
    }
});

function createImg(dateStr) {
    let date = Date.parse(dateStr);
    let seconds = Math.floor(date/1000);
    let rgbs = [];
    for(let i = 0; i<3; i++) {
        rgbs.push(seconds%220 + 36);
        seconds = Math.floor(seconds/256);
    }
    return ("rgb(" + rgbs[0] + ", " + rgbs[1] + ", " + rgbs[2] + ")");
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

app.post("/loadComments", function(request, response) {
    const imageId = request.body.imageId;
    const currentUser = request.session.thisUserId;
    database.getComments(imageId, function(results) {
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
    const comment = request.body.comment;
    const imageId = request.body.imageId;
    database.addComment(currentUser, imageId, comment, function(result) {
        response.send({result: (result !== undefined)});
    });
});

app.post("/deleteComment", function(request, response) {
    const encyptedId = request.body.encyptedId;
    let id = parseInt(decrypt(encyptedId).trim());
    database.deleteComment(id, function(result) {
        response.send({result: (result !== undefined)});
    });
});

app.post("/countLikes", function(request, response) {
    const imageId = request.body.imageId;
    const currentUser = request.session.thisUserId;
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
    const imageId = request.body.imageId;
    database.getLikes(imageId, function(results) {
        response.send(results);
    });
});

app.post("/like", function(request, response) {
    const imageId = request.body.imageId;
    const currentUser = request.session.thisUserId;
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


/*
    My "Encrypting" and "Decrypting"
*/
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


app.listen(PORT_ID, function() {
    console.log("Listens at Port: ", PORT_ID);
});
