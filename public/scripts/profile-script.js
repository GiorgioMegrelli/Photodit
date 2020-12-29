function showUpdateWindow(bool) {
    byClass("front-data-update-window")[0].style.display = (bool)? "block": "none";
    byClass("user-info-update-profile")[0].disabled = bool;
}

const localhost = "http://localhost:8089/user/";

function copyURL(uid) {
    var textArea = createElement("textarea");
    textArea.value = localhost + uid;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    alert("Your URL Copied");
}
