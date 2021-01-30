function showUpdateWindow(bool) {
    byClass("front-data-update-window")[0].style.display = (bool)? "block": "none";
    byClass("user-info-update-profile")[0].disabled = bool;
}

function copyURL(uid) {
    let textArea = createTag("textarea");
    textArea.value = window.location.origin + "/user/" + uid;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    alert("Your URL Copied");
}
