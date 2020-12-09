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
            document.getElementById("num-data-followings").innerHTML = result.followingsNum;
            document.getElementById("num-data-followers").innerHTML = result.followersNum;
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
            document.getElementById("num-data-likes").innerHTML = result.likeNum;
            document.getElementById("num-data-comments").innerHTML = result.commentNum;
        }
    };
    xhttp.open("post", "/getFullNumbersLC", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=" + getUrlId().toString());
}

function getPhotos() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let list = document.getElementById("images-list");
            console.log(result);
            document.getElementById("num-data-photos").innerHTML = result.length;
            for(let i = 0; i<result.length; i++) {
                let imgBoxHref = document.createElement("a");
                imgBoxHref.href = "/image/" + result[i].PHOTO_ID;
                let imgBox = document.createElement("div");
                imgBox.className = "images-list-item";
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
                imgBox.appendChild(img);
                imgBoxHref.appendChild(imgBox);
                list.appendChild(imgBoxHref);
            }
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
            let list = document.getElementById("f-d-followings");
            list.innerHTML = "";
            if(result.length == 0) {

            } else {
                for(let i = 0; i<result.length; i++) {
                    let item = document.createElement("a");
                    item.href = "/user/" + result[i].ID;
                    item.innerHTML = result[i].USERNAME;
                    item.className = "front-data-follow-item";
                    list.appendChild(item);
                }
            }
            document.getElementsByClassName("front-data-followings")[0].style.display = "block";
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
            let list = document.getElementById("f-d-followers");
            list.innerHTML = "";
            if(result.length == 0) {

            } else {
                for(let i = 0; i<result.length; i++) {
                    let item = document.createElement("a");
                    item.href = "/user/" + result[i].ID;
                    item.innerHTML = result[i].USERNAME;
                    item.className = "front-data-follow-item";
                    list.appendChild(item);
                }
            }
            document.getElementsByClassName("front-data-followers")[0].style.display = "block";
        }
    };
    xhttp.open("post", "/getFollowers", true);
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
    document.getElementsByClassName("front-data-followings")[0].style.display = "none";
}

function closeFList2() {
    document.getElementsByClassName("front-data-followers")[0].style.display = "none";
}
