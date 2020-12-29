function fillNumberData1() {
    Ajax("post", "/getFullNumbersFF", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        byId("num-data-followings").innerHTML = result.followingsNum;
        byId("num-data-followers").innerHTML = result.followersNum;
    }).catch((err) => {
        console.error(err);
    });
}

function fillNumberData2() {
    Ajax("post", "/getFullNumbersPLC", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        byId("num-data-photos").innerHTML = result.imageNum;
        byId("num-data-likes").innerHTML = result.likeNum;
        byId("num-data-comments").innerHTML = result.commentNum;
    }).catch((err) => {
        console.error(err);
    });
}

function getPhotos() {
    let loader = byClass("image-pre-loader")[0].style;
    loader.display = "block";
    Ajax("post", "/getPhotos", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        let list = byId("images-list");
        list.innerHTML = "";
        for(let i = 0; i<result.length; i++) {
            let imgBoxHref = createAnchor("/image/" + result[i].PHOTO_ID);
            let imgBox = createDiv("images-list-item");
            let img = new Image();
            img.src = result[i].src;
            img.onload = function() {
                let ratio = this.width/this.height;
                this.className = ["images-list-item-img_", (ratio == 1)? 0: ((ratio < 1)? -1: 1)].join("");
            };
            img.onerror = function() {
                this.parentNode.style.display = "none";
            };
            let imgLikeNum = createDiv("images-list-item-like-num");
            let imgLikeNum_div1 = createDiv();
            let imgLikeNum_div2 = createDiv();
            imgLikeNum_div1.appendChild(createParagraph("images-list-item-like-num-p", result[i].LIKE_NUM));
            imgLikeNum_div2.appendChild(createIcon("material-icons material-icons-my-confgs-1", "thumb_up"));
            appendChildsArray(imgLikeNum, [imgLikeNum_div1, imgLikeNum_div2]);
            appendChildsArray(imgBox, [img, imgLikeNum]);
            imgBoxHref.appendChild(imgBox);
            list.appendChild(imgBoxHref);
        }
        loader.display = "none";
    }).catch((err) => {
        console.error(err);
    });
}

function showFollowings() {
    Ajax("post", "/getFollowings", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        let list = byId("f-d-followings");
        list.innerHTML = "";
        if(result.length == 0) {
            list.appendChild(createParagraph("front-data-ff-no", "No Followings"));
        } else {
            for(let i = 0; i<result.length; i++) {
                let item = createAnchor("/user/" + result[i].ID, "front-data-follow-item");
                item.innerHTML = result[i].USERNAME;
                list.appendChild(item);
            }
        }
        byClass("front-data-followings")[0].style.display = "block";
    }).catch((err) => {
        console.error(err);
    });
}

function showFollowers() {
    Ajax("post", "/getFollowers", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        let list = byId("f-d-followers");
        list.innerHTML = "";
        if(result.length == 0) {
            list.appendChild(createParagraph("front-data-ff-no", "No Followings"));
        } else {
            for(let i = 0; i<result.length; i++) {
                let item = createAnchor("/user/" + result[i].ID, "front-data-follow-item");
                item.innerHTML = result[i].USERNAME;
                list.appendChild(item);
            }
        }
        byClass("front-data-followers")[0].style.display = "block";
    }).catch((err) => {
        console.error(err);
    });
}

function followUser() {
    Ajax("post", "/followUser", {userId: getUrlId().toString()}).then(function(responseText) {
        let result = JSON.parse(responseText);
        let type_true = (result.type == 1);
        byId("user-username-follow").className = (type_true)? "u-i-u-followed": "u-i-u-unfollowed";
        byId("follow-button-text").innerHTML = (type_true)? "Unfollow": "Follow";
        byId("follow-button-icon-i").innerHTML = (type_true)? "check_box": "person_add";
        fillNumberData1();
        getPhotos();
    }).catch((err) => {
        console.error(err);
    });
}

function closeFList1() {
    byClass("front-data-followings")[0].style.display = "none";
}
function closeFList2() {
    byClass("front-data-followers")[0].style.display = "none";
}

function closeShowStatus() {
    let none_equal = (byClass("user-info-status-span")[0].style.display.trim().toLowerCase() === "none");
    byClass("user-info-status-span")[0].style.display = (none_equal)? "block": "none";
    byClass("user-info-status-p")[0].innerHTML = (none_equal)? "Close Status": "Show Status";
}

function closePInfo(bool) {
    let container = byId("u-i-personal-button");
    container.setAttribute("onclick", ["closePInfo(", !bool, ")"].join(""));
    container.innerHTML = [(bool)? "Open": "Close", " Personal Information"].join("");
    let items = byClass("user-info-personal-p");
    for(let i = 0; i<items.length; i++) {
        items[i].style.display = (bool)? "none": "block";
    };
}

function copyEmail() {
    var copyText = byId("copy-email");
    var textArea = createElement("textarea");
    textArea.value = copyText.innerHTML;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    alert("Email Copied");
}
