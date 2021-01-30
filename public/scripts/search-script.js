window.addEventListener("load", function() {
    let searchButton = byId("search-input-gl-button");
    if(searchButton !== null) {
        searchButton.addEventListener("click", function(event) {
            let inputField = byId("search-input-gl-input").value.trim();
            if(inputField.length == 0) {
                let confirmText = "Input field is empty! Do you want to search with Empty data?\nEverything will be shown!";
                if(!confirm(confirmText)) {
                    event.preventDefault();
                    return false;
                }
            }
            return true;
        });
    }
});
