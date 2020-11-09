function testFun() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            document.body.innerHTML = this.responseText;
        }
    };
    xhttp.open("post", "/test", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
}


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
    let password = byId("reg-password").value.trim();
    let password_rep = byId("reg-password").value.trim();

    if(password !== password_rep) {
        alert("Incorrect Repeated Password!");// TODO
    } else {
        let uname = byId("reg-uname").value.trim();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let result = parseInt(this.responseText);
                if(result == -1) {
                    console.error("Internal Error!");
                } else if(result == 1) {
                    alert("Username Already Exists!");// TODO
                } else if(result == 0) {
                    byId("register-form").submit();
                }
            }
        };
        xhttp.open("post", "/register-check", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("uname=" + uname);
    }
}

function byId(id) {
    return document.getElementById(id);
}
