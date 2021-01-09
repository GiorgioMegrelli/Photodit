function showUpdateWindow(bool) {
    byClass("front-data-update-window")[0].style.display = (bool)? "block": "none";
    byClass("user-info-update-profile")[0].disabled = bool;
}

function copyURL(uid) {
    let localhost = "http://localhost:8089/user/";
    let textArea = createElement("textarea");
    textArea.value = localhost + uid;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    alert("Your URL Copied");
}
