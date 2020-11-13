const INTERNAL_ERR = "Internal Server Error!";
const INCORRECT_U_P = "Incorrect Username or Password";
const INCORRECT_P = "Incorrect Password";
const INCORRECT_REPEAT = "Repeat Password Correctly";
const USED_U = "Username Already Exists";


function login() {
    let uname = byId("log-uname").value.trim();
    let password = byId("log-password").value.trim();
    let output = byId("output-error");
    output.innerHTML = "";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let result = parseInt(this.responseText);
            if(result == -1) {
                console.error(INTERNAL_ERR);
            } else if(result == 2) {
                output.innerHTML = INCORRECT_U_P;
            } else if(result == 1) {
                output.innerHTML = INCORRECT_P;
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
    let password_rep = byId("reg-password-rep").value.trim();
    let output = byId("output-error");
    output.innerHTML = "";

    if(password !== password_rep) {
        output.innerHTML = INCORRECT_REPEAT;
    } else {
        let uname = byId("reg-uname").value.trim();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let result = parseInt(this.responseText);
                if(result == -1) {
                    console.error(INTERNAL_ERR);
                } else if(result == 1) {
                    output.innerHTML = USED_U;
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

function showSpace(type) {
    // true - Sign Up, false - Log In
    if(type) {
        byClass("log-space")[0].style.display = "none";
        byClass("reg-space")[0].style.display = "block";
    } else {
        byClass("log-space")[0].style.display = "block";
        byClass("reg-space")[0].style.display = "none";
    }
}


function byId(id) {
    return document.getElementById(id);
}
function byClass(cls) {
    return document.getElementsByClassName(cls);
}
