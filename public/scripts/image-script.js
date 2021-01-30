window.addEventListener("load", function() {
    loadComments();
    countLikes();
    preventImgEvents();
});

function preventImgEvents() {
    let imgs = byTag("img");
    ["click", "contextmenu", "dblclick", "mousedown", "mouseup"].forEach(function(eventType) {
        for(let i = 0; i<imgs.length; i++) {
            imgs[i].addEventListener(eventType, function(event) {
                event.preventDefault();
                return false;
            });
        }
    });
}

function loadComments() {
    let loader = byClass("comments-loader")[0].style;
    loader.display = "block";
    Ajax("post", "/loadComments", {"imageId": getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        let length = result.length;
        let list = byClass("comments-list")[0];
        list.innerHTML = "";
        loader.display = "none";
        if(length == 0) {
            list.appendChild(createTag("P", {
                className: "not-found-coms",
                innerHTML: "Comments Not Found"
            }));
        } else {
            for(let i = 0; i<length; i++) {
                list.appendChild(createCommentBox(result[i]));
            }
        }
        byId("comment-number").innerHTML = length;
    }).catch((err) => {
        console.error(err);
    });
}

function deleteComment(encrIndex) {
    let confirmed = confirm("Do you really want to Delete Your comment?");
    if(confirmed) {
        Ajax("post", "/deleteComment", {"encyptedId": encrIndex}).then(function(responseText) {
            let result = JSON.parse(responseText);
            if(result.result) {
                /*let box = byId(encrIndex);
                for(let i = 0; i<4; i++) {  // To "comments-list"
                    box = box.parentNode;
                }
                box.parentNode.removeChild(box);
                let comNumber = byId("comment-number");
                let oldCount = parseInt(comNumber.innerHTML.trim());
                comNumber.innerHTML = (oldCount - 1);
                if(oldCount == 1) {
                    byClass("comments-list")[0].appendChild(createTag("p", {
                        className: "not-found-coms",
                        innerHTML: "Comments Not Found"
                    }));
                }*/
                loadComments();
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}

function sendComment() {
    let element = byId("comment-input");
    let comment = element.value.trimEnd();
    element.value = "";
    Ajax("post", "/addComment", {
        "comment": comment,
        "imageId": getUrlId().toString()
    }).then(function(responseText) {
        let result = JSON.parse(responseText);
        if(result.result) {
            loadComments();
        }
    }).catch((err) => {
        console.error(err);
    });
}

function createCommentBox(rowData) {
    /* See Comment Box structure at bottom of the page */
    let mainBox = createDiv({className: "comment-box"});
    // comment-box-user
    let boxUser = createTag("p", {className: "comment-box-user"});
    let userName = createTag("a", {
        href: ((rowData.IS_AUTHOR)? "/profile": ("/user/" + rowData.COMMENTER)),
        innerHTML: rowData.USERNAME
    });
    let timeLeft = createTag("span", {
        innerHTML: formatDateComment(Date.parse(rowData.COMMENT_DATE))
    });
    appendChildsArray(boxUser, [userName, timeLeft]);
    // comment-box-data
    let boxData = createDiv({className: "comment-box-data"});
    let imgAndSettings = createDiv({style: "position: relative;"});
    let boxImg = createDiv({
        className: "comment-box-img",
        style: "background-color: " + (rowData.BACK_COLOR || "black") + ";"
    });
    boxImg.appendChild(createTag("p", {
        className: "comment-box-img-p",
        innerHTML: rowData.USERNAME.charAt(0).toUpperCase()
    }));
    imgAndSettings.appendChild(boxImg);
    if(rowData.IS_AUTHOR) {
        let settings = createDiv({className: "settings"});
        let settingsP = createTag("p", {
            title: "Delete Your Comment",
            id: rowData.ENCRYPT_ID
        });
        settingsP.addEventListener("click", function() {
            deleteComment(rowData.ENCRYPT_ID);
        });
        appendChildsArray(settingsP, [createIcon("material-icons", "delete"), createTextNode(" Delete")]);
        settings.appendChild(settingsP);
        imgAndSettings.appendChild(settings);
        let authorTag = createIcon("material-icons comment-author-tag", "check_box", {
            title: "Author of this Image"
        });
        appendChildsArray(userName, [createTextNode(" "), authorTag]);
    }
    let commentText = createDiv({
        className: "comment-box-text",
        innerHTML: rowData.COMMENT
    });
    appendChildsArray(boxData, [imgAndSettings, commentText]);
    appendChildsArray(mainBox, [boxUser, boxData]);
    return mainBox;
}

function showSettings(bool) {
    byClass("image-settings-content")[0].style.left = (bool)? "0": "-100%";
    byId("image-setts-button").setAttribute("onclick", ["showSettings(", !bool, ")"].join(""));
}

function deleteThisImage() {
    let confirmed = confirm("Do you really want to delete this Image?");
    if(confirmed) {
        byId("image-del-form-input").value = getUrlId().toString().trim();
        byId("image-del-form").submit();
    }
}

function sendLike() {
    Ajax("post", "/like", {"imageId": getUrlId().toString()}).then(function() {
        countLikes();
    }).catch((err) => {
        console.error(err);
    });
}

function getLikes() {
    let likeList = byId("likes-list");
    likeList.innerHTML = "";
    Ajax("post", "/getLikes", {"imageId": getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        likeList.innerHTML = "";
        for(let i = 0; i<result.length; i++) {
            let like = createTag("a", {
                href: "/user/" + result[i].USER_ID,
                className: "liker-list-item"
            });
            like.innerHTML = result[i].USERNAME;
            likeList.append(like);
        }
    }).catch((err) => {
        console.error(err);
    });
}


function countLikes() {
    Ajax("post", "/countLikes", {"imageId": getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        byId("like-number").innerHTML = result.count;
        let likeButton = byId("like-button");
        if(likeButton !== null) {
            likeButton.innerHTML = "";
            likeButton.appendChild(createIcon((result.hasLiked)? "fa fa-thumbs-up": "fa fa-thumbs-o-up"));
            likeButton.appendChild(createTextNode((result.hasLiked)? " Unlike": " Like"));
            likeButton.style.backgroundColor = (result.hasLiked)? "#E6E6E6": "rgba(5, 122, 95, 1)";
            likeButton.style.color = (result.hasLiked)? "black": "white";
        }
    }).catch((err) => {
        console.error(err);
    });
}

function closePupup1() {
    byClass("overflow-content")[0].style.display = "none";
}

function showLikes() {
    byClass("overflow-content")[0].style.display = "block";
    getLikes();
}

function changeVisibility() {
    Ajax("post", "/changeVisibility", {
        "imageId": getUrlId().toString(),
        "vtypeId": byId("vis-type-select").value.trim()
    }).then(function(responseText) {
        let result = JSON.parse(responseText);
        if(result.result) {
            alert("Visibility Changed");
        }
    }).catch((err) => {
        console.error(err);
    });
}

const TIME = {
    MINUTE: 60,
    HOUR: 60*60,
    DAY: 24*60*60,
    WEEK: 7*24*60*60
};

function formatDateComment(date) {
    let diff = Math.floor(Math.abs(Date.now() - date)/1000);
    let result;
    if(diff == 0) {
        return " now";
    } else if(diff < TIME.MINUTE) {
        result = diff;
        result += ((result == 1)? " second": " seconds");
    } else if(diff < TIME.HOUR) {
        result = Math.floor(diff/TIME.MINUTE);
        result += ((result == 1)? " minute": " minutes");
    } else if(diff < TIME.DAY) {
        result = Math.floor(diff/TIME.HOUR);
        result += ((result == 1)? " hour": " hours");
    } else if(diff < TIME.WEEK) {
        result = Math.floor(diff/TIME.DAY);
        result += ((result == 1)? " day": " days");
    } else {
        result = Math.floor(diff/TIME.WEEK);
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
