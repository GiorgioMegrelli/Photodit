const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const multer = require("multer");
const database = require("./database/database");


const PORT_ID = 8089;
const destination = "upload/";


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
        response.sendFile(__dirname + "/views/profile.html");
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
    console.log(userId);
});

app.get("/image/:imageId", function(request, response) {
    const imageId = request.params.imageId;
    const reTypes = {
        RETURN_ERR: -1,
        RETURN_FALSE: 0,
        RETURN_TRUE: 1
    };
    let returnVal = {};
    if(isNaN(imageId)) {
        returnVal["reType"] = RETURN_ERR;
        returnVal["msg"] = "Invalid URL of Image";
    } else {
        const id = parseInt(imageId);
        const visibilities = {
            PUBLIC: 1,
            PROTECTED: 2,
            PRIVATE: 3
        };
        database.getPhoto(id, function(result) {
            // TODO
            if(result === undefined) {
                returnVal["reType"] = RETURN_FALSE;
                returnVal["msg"] = "Image with this ID: " + id + " - doesn't Exist";
            } else {
                /*const vType = parseInt(result2.TYPE_ID);
                if(vType == visibilities.PRIVATE) {
                    returnVal["msg"] = "Only Owner of this Image can see it!";
                } else {
                    returnVal["img"] = {};
                    returnVal["img"].push(result);
                }
                returnVal["reType"] = RETURN_TRUE;*/
            }
            returnVal["vars"] = Object.assign(reTypes, visibilities);
            //response.render("image", returnVal);
            request.session.imageId = imageId;
            response.sendFile(__dirname + "/views/image.html");
            //response.render("image");
            // TODO: set img id to session
        });
    }
});

app.post("/loadComments", function(request, response) {
    const imageId = request.session.imageId;
    database.getComments(imageId, function(results) {
        for(let i = 0; i<results.length; i++) {
            results[i].COMMENT_DATE = results[i].COMMENT_DATE.toString();
        }
        response.send(JSON.stringify(results));
    });
});

app.post("/addComment", function(request, response) {
    const currentUser = request.session.thisUserId;
    const comment = request.body.comment;
    const imageId = request.session.thisImageId;
    database.addComment(currentUser, comment, imageId, function(result) {
        response.send({result: (result !== undefined)});
    });
});


app.listen(PORT_ID, function() {
    console.log("Listens at Port: ", PORT_ID);
});
