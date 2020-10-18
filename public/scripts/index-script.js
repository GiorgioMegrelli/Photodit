function login() {
    let uname = byId("log-uname").value.trim();
    let password = byId("log-password").value.trim();

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = parseInt(this.responseText);
            if(result == -1) {
                console.error("Internal Error!");
            } else if(result == 2) {
                alert("Username doesn't exist!");// TODO
            } else if(result == 1) {
                alert("Incorrect Password!");// TODO
            } else if(result == 0) {
                byId("login-form").submit();
            }
        }
    };
    xhttp.open("post", "/login-check", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let array = [["uname", uname], ["password", password]];
    array.forEach(function(elem, i) {
        array[i] = elem.join("=");
    });
    xhttp.send(array.join("&"));
}

function register() {
    let uname = byId("reg-name").value.trim();
    let password = byId("reg-password").value.trim();
    let email = byId("reg-email").value.trim();
}

function byId(id) {
    return document.getElementById(id);
}
