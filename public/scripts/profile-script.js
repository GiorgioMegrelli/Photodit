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

(function() {
    let preventUpload = function(event) {
        event.preventDefault();
        alert([
            "As this application works with virtual database.",
            "You can't upload any image now."
        ].join("\n"));
        return false;
    };
    byId("image-upload-form").addEventListener("submit", preventUpload);
    byId("image-upload-form-submit").addEventListener("click", preventUpload);
    byId("image-upload-form-input").addEventListener("click", preventUpload);
    byId("image-upload-form-textarea").addEventListener("focus", preventUpload);
})();
