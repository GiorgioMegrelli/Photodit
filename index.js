const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const database = require("./database/database");

const app = express();
const upload = multer({
    dest: "upload/"
});


const PORT_ID = 8089;


app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(request, response) {
    response.sendFile(__dirname + "/views/index.html");
});

app.post("/login-check", function(request, response) {
    let username = request.body.uname;
    let password = request.body.password;
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
    // TODO
});

app.post("/register-check", function(request, response) {
    // TODO
});

app.post("/register", function(request, response) {
    // TODO
});

app.get("/user/:userId", function(request, response) {
    // TODO
});

app.get("/image/:imageId", function(request, response) {
    // TODO
});

app.post("/upload", upload.single("imgpath"), function(request, response) {
    console.log(request.file);
    // TODO
});


app.listen(PORT_ID, function() {
    console.log("Listens at Port: ", PORT_ID);
});
