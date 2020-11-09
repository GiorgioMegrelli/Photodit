window.onload = function() {
    loadComments();
};

function loadComments() {
    let loader = document.getElementsByClassName("comments-loader")[0];
    //loader.style.display = "block";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let list = document.getElementsByClassName("comments-list")[0];
            list.innerHTML = "";
            loader.style.display = "none";
            /*for(let i = 0; i<result.length; i++) {
                list.appendChild(createCommentBox(result[i]));
            }*/
            document.getElementById("comment-number").innerHTML = result.length;
        }
    };
    xhttp.open("post", "/loadComments", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
}


function createCommentBox(elem) {
    let node = createElement("div");
    let node1 = createElement("div");
    let node2 = createElement("div");
    let node_p1 = createElement("p");
    let node_p2 = createElement("p");
    let node_a = createElement("a");
    node.className = "comment-box";
    node1.className = "comment-box-img";
    node2.className = "comment-box-data";
    node_p1.className = "comment-box-user";
    node_p2.className = "comment-box-text";
    let time = Date.parse(elem.COMMENT_DATE);
    node_a.innerHTML = elem.USERNAME;
    node_a.href = "/user/" + elem.COMMENTER;
    node_p1.appendChild(node_a);
    node_p1.appendChild(document.createTextNode(formatDate(time)));
    node_p2.innerHTML = elem.COMMENT;
    node2.appendChild(node_p1);
    node2.appendChild(node_p2);
    node.appendChild(node1);
    node.appendChild(node2);
    return node;
}

function createImg(date) {
    let seconds = Math.floor(date/1000);
    let rgbs = [];
    for(let i = 0; i<3; i++) {
        rgbs.push(seconds%256);
        seconds = Math.floor(seconds/256);
    }
    return ("rgb(" + rgbs[0] + ", " + rgbs[1] + ", " + rgbs[2] + ")");
}

function createElement(tag) {
    return document.createElement(tag);
}

const MINUTE = 60;
const HOUR = 60*MINUTE;
const DAY = 24*HOUR;
const WEEK = 7*DAY;

function formatDate(date) {
    let diff = Math.floor(Math.abs(Date.now() - date)/1000);
    let result;
    if(diff == 0) {
        return " now";
    } else if(diff < MINUTE) {
        result = diff;
        result += ((result == 1)? " second": " seconds");
    } else if(diff < HOUR) {
        result = Math.floor(diff/MINUTE);
        result += ((result == 1)? " minute": " minutes");
    } else if(diff < DAY) {
        result = Math.floor(diff/HOUR);
        result += ((result == 1)? " hour": " hours");
    } else if(diff < WEEK) {
        result = Math.floor(diff/DAY);
        result += ((result == 1)? " day": " days");
    } else {
        result = Math.floor(diff/WEEK);
        result += ((result == 1)? " week": " weeks");
    }
    return result + " ago";
}

function sendComment() {
    let element = document.getElementById("comment-input");
    let value = element.value.trimEnd();
    element.value = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let res = parseInt(this.responseText);
            if(res == 1) {

            }
        }
    };
    xhttp.open("post", "/addComment", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(value);
}
