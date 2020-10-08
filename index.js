const PORT_ID = 8089;

const path = require("path");
const ejs = require("ejs");
const express = require("express");
const app = express();


app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));


app.get("/", function(request, response) {
    response.render("index");
});


app.listen(PORT_ID, function() {
    console.log("Listens at Port: ", PORT_ID);
});
