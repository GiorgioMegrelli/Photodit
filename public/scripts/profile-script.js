function showUpdateWindow(bool) {
    byClass("front-data-update-window")[0].style.display = (bool)? "block": "none";
    byClass("user-info-update-profile")[0].disabled = bool;
}
