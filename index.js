const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "3.14159265359", saveUninitialized: true, resave: true}));


app.get("/", function(request, response) {
    response.render("index");
});

app.post("/login-check", function(request, response) {
    const username = request.body.uname;
    const password = request.body.password;
    if(username === undefined || password === undefined) {
        response.send("-1");
    } else {
        database.checkUsername(username, function(result) {
            if(!result) {
                response.send("2");
            } else {
                database.checkPassword(username, password, function(result2) {
                    if(!result2) {
                        response.send("1");
                    } else {
                        response.send("0");
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
        response.send("-1");
    } else {
        database.checkUsername(username, function(result) {
            if(result) {
                response.send("1");
            } else {
                response.send("0");
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
        response.render("profile", {});
    }
});

app.post("/upload", upload.single("imgpath"), function(request, response) {
    const currentUser = request.session.thisUserId;
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
    console.log(request.query);
    // TODO
});

app.get("/image/:imageId", function(request, response) {
    console.log(request.query);
    // TODO
});


app.listen(PORT_ID, function() {
    console.log("Listens at Port: ", PORT_ID);
});
