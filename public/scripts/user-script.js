window.onload = function() {
    fillNumberData1();
    fillNumberData2();
    getPhotos();
};

function fillNumberData1() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            byId("num-data-followings").innerHTML = result.followingsNum;
            byId("num-data-followers").innerHTML = result.followersNum;
        }
    };
    xhttp.open("post", "/getFullNumbersFF", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function fillNumberData2() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            byId("num-data-photos").innerHTML = result.imageNum;
            byId("num-data-likes").innerHTML = result.likeNum;
            byId("num-data-comments").innerHTML = result.commentNum;
        }
    };
    xhttp.open("post", "/getFullNumbersPLC", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function getPhotos() {
    let loader = byClass("image-pre-loader")[0].style;
    loader.display = "block";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let list = byId("images-list");
            list.innerHTML = "";
            for(let i = 0; i<result.length; i++) {
                let imgBoxHref = createElement("a");
                imgBoxHref.href = "/image/" + result[i].PHOTO_ID;
                let imgBox = createElement("div", "images-list-item");
                let img = new Image();
                img.src = result[i].src;
                img.onload = function() {
                    let ratio = this.width/this.height;
                    if(ratio == 1) {
                        this.className = "images-list-item-img_0";
                    } else if(ratio < 1) {
                        this.className = "images-list-item-img_-1";
                    } else {
                        this.className = "images-list-item-img_1";
                    }
                };
                let imgLikeNum = createElement("div", "images-list-item-like-num");
                let imgLikeNum_div1 = createElement("div");
                let imgLikeNum_div2 = createElement("div");
                let imgLikeNum_p = createElement("p", "images-list-item-like-num-p");
                let imgLikeNum_i = createElement("i", "material-icons material-icons-my-confgs-1");
                imgLikeNum_p.appendChild(createTextNode(result[i].LIKE_NUM));
                imgLikeNum_i.appendChild(createTextNode("thumb_up"));
                imgLikeNum_div1.appendChild(imgLikeNum_p);
                imgLikeNum_div2.appendChild(imgLikeNum_i);
                imgLikeNum.appendChild(imgLikeNum_div1);
                imgLikeNum.appendChild(imgLikeNum_div2);
                imgBox.appendChild(img);
                imgBox.appendChild(imgLikeNum);
                imgBoxHref.appendChild(imgBox);
                list.appendChild(imgBoxHref);
            }
            loader.display = "none";
        }
    };
    xhttp.open("post", "/getPhotos", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function showFollowings() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let list = byId("f-d-followings");
            list.innerHTML = "";
            if(result.length == 0) {
                let nofs = createElement("p", "front-data-ff-no");
                nofs.innerHTML = "No Followings";
                list.appendChild(nofs);
            } else {
                for(let i = 0; i<result.length; i++) {
                    let item = createElement("a", "front-data-follow-item");
                    item.href = "/user/" + result[i].ID;
                    item.innerHTML = result[i].USERNAME;
                    list.appendChild(item);
                }
            }
            byClass("front-data-followings")[0].style.display = "block";
        }
    };
    xhttp.open("post", "/getFollowings", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function showFollowers() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let list = byId("f-d-followers");
            list.innerHTML = "";
            if(result.length == 0) {
                let nofs = createElement("p", "front-data-ff-no");
                nofs.innerHTML = "No Followers";
                list.appendChild(nofs);
            } else {
                for(let i = 0; i<result.length; i++) {
                    let item = createElement("a", "front-data-follow-item");
                    item.href = "/user/" + result[i].ID;
                    item.innerHTML = result[i].USERNAME;
                    list.appendChild(item);
                }
                console.log(result)
            }
            byClass("front-data-followers")[0].style.display = "block";
        }
    };
    xhttp.open("post", "/getFollowers", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function followUser() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let u_u_follow = byId("user-username-follow");
            let butText = byId("follow-button-text");
            let butIcon = byId("follow-button-icon-i");
            if(result.type == 1) {
                u_u_follow.className = "u-i-u-followed";
                butText.innerHTML = "Unfollow";
                butIcon.innerHTML = "check_box";
            } else {
                u_u_follow.className = "u-i-u-unfollowed";
                butText.innerHTML = "Follow";
                butIcon.innerHTML = "person_add";
            }
            fillNumberData1();
            getPhotos();
        }
    };
    xhttp.open("post", "/followUser", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
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

function closeFList1() {
    byClass("front-data-followings")[0].style.display = "none";
}

function closeFList2() {
    byClass("front-data-followers")[0].style.display = "none";
}

function closeShowStatus() {
    let status = byClass("user-info-status-span")[0].style;
    let status_p = byClass("user-info-status-p")[0];
    if(status.display.trim().toLowerCase() === "none") {
        status.display = "block";
        status_p.innerHTML = "Close Status";
    } else {
        status.display = "none";
        status_p.innerHTML = "Show Status";
    }
}

function closePInfo(bool) {
    let container = byId("u-i-personal-button");
    container.setAttribute("onclick", ["closePInfo(", !bool, ")"].join(""));
    container.innerHTML = [(bool)? "Open": "Close", " Personal Information"].join("");
    let items = byClass("user-info-personal-p");
    for(let i = 0; i<items.length; i++) {
        let item = items[i];
        if(bool) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }
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
