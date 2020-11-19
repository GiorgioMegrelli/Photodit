window.onload = function() {
    loadComments();
};

function loadComments() {
    let loader = document.getElementsByClassName("comments-loader")[0];
    loader.style.display = "block";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let length = result.length;
            let list = document.getElementsByClassName("comments-list")[0];
            list.innerHTML = "";
            loader.style.display = "none";
            if(length != 0) {
                for(let i = 0; i<length; i++) {
                    list.appendChild(createCommentBox(result[i]));
                }
            } else {
                let node = createElement("p", "not-found-coms");
                node.innerHTML = "Comments Not Found";
                list.appendChild(node);
            }
            document.getElementById("comment-number").innerHTML = length;
        }
    };
    xhttp.open("post", "/loadComments", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("imageId=" + getUrlId().toString());
}

function deleteComment(encrIndex) {
    let confirmed = confirm("Do you really want to delete your comment?");
    if(confirmed) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let result = JSON.parse(this.responseText);
                if(result.result) {
                    let box = document.getElementById(encrIndex);
                    for(let i = 0; i<4; i++) {  // To "comments-list"
                        box = box.parentNode;
                    }
                    box.parentNode.removeChild(box);
                    let comNumber = document.getElementById("comment-number");
                    let oldCount = parseInt(comNumber.innerHTML);
                    comNumber.innerHTML = (oldCount - 1);
                    if(oldCount == 1) {
                        let node = createElement("p", "not-found-coms");
                        node.innerHTML = "Comments Not Found";
                        document.getElementsByClassName("comments-list")[0].appendChild(node);
                    }
                }
            }
        };
        xhttp.open("post", "/deleteComment", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("encyptedId=" + encrIndex);
    }
}

function sendComment() {
    let element = document.getElementById("comment-input");
    let value = element.value.trimEnd();
    element.value = "";
    let urlId = getUrlId().toString();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            if(result.result) {
                loadComments();
            }
        }
    };
    xhttp.open("post", "/addComment", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let array = [["comment", value], ["imageId", urlId]];
    array.forEach(function(elem, i) {
        array[i] = elem.join("=");
    });
    xhttp.send(array.join("&"));
}

function createCommentBox(rowData) {
    let mainBox = createElement("div", "comment-box");
    // comment-box-user
    let boxUser = createElement("p", "comment-box-user");
    let userName = createElement("a");
    userName.href = "/user/" + rowData.COMMENTER;
    userName.innerHTML = rowData.USERNAME;
    boxUser.appendChild(userName);
    let timeLeft = createElement("span");
    let time = Date.parse(rowData.COMMENT_DATE);
    timeLeft.innerHTML = formatDate(time);
    boxUser.appendChild(timeLeft);
    mainBox.appendChild(boxUser);
    // comment-box-data
    let boxData = createElement("div", "comment-box-data");
    let imgAndSettings = createElement("div");
    imgAndSettings.style = "position: relative;";
    let boxImg = createElement("div", "comment-box-img");
    if(rowData.P_IMG == null) {
        boxImg.style.backgroundColor = ((rowData.BACK_COLOR !== undefined)? rowData.BACK_COLOR: "black");
        let boxImgP = createElement("p", "comment-box-img-p");
        boxImgP.innerHTML = rowData.USERNAME.charAt(0).toUpperCase();
        boxImg.appendChild(boxImgP);
    }
    imgAndSettings.appendChild(boxImg);
    if(rowData.IS_AUTHOR) {
        let settings = createElement("div", "settings");
        let settingsP = createElement("p");
        settingsP.title = "Delete Your Comment";
        settingsP.id = rowData.ENCRYPT_ID;
        settingsP.onclick = function() {
            deleteComment(rowData.ENCRYPT_ID);
        };
        let deleteIcon = createElement("i", "material-icons");
        deleteIcon.innerHTML = "delete";
        settingsP.appendChild(deleteIcon);
        settingsP.appendChild(document.createTextNode(" Delete"));
        settings.appendChild(settingsP);
        imgAndSettings.appendChild(settings);
        let authorTag = createElement("i", "material-icons");
        authorTag.innerHTML = "check_box";
        authorTag.style = "color: rgba(5, 122, 95, 1); position: relative; top: 4px; font-size: 22px;";
        authorTag.title = "Author of this Image";
        userName.appendChild(document.createTextNode(" "));
        userName.appendChild(authorTag);
    }
    boxData.appendChild(imgAndSettings);
    let commentText = createElement("div", "comment-box-text");
    commentText.innerHTML = rowData.COMMENT;
    boxData.appendChild(commentText);
    mainBox.appendChild(boxData);
    return mainBox;
}

function createElement(tag, className) {
    let node = document.createElement(tag);
    if(className !== undefined) {
        node.className = className;
    }
    return node;
}

function getUrlId() {
    let url = window.location.href || document.URL;
    let splitUrl = url.split("/");
    if(splitUrl.length <= 1) {
        return undefined;
    }
    let imageId = splitUrl[splitUrl.length - 1].trim();
    return parseInt(imageId);
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


/**
Comment Box Structure

<div class="comment-box">
    <p class="comment-box-user">
        <a href="/user/?">
        <span>time left
    <div class="comment-box-data">
        <div style="position: relative;">
            <div class="comment-box-img">
                <p class="comment-box-img-p">N
            <div class="settings">
                <p title="Delete Your Comment"><i class="fa fa-eraser"> Delete
        <div class="comment-box-text">
</div>
**/
