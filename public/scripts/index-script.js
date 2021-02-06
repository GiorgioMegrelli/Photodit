window.addEventListener("load", function() {
    alert([
        "This web application works with virtual Database!",
        "Please, use one from existing accounts.",
        "Usernames:",
        "• Bla",
        "• John",
        "• admin",
        "All accounts have same password - \"admin\""
    ].join("\n"));
});


const MESSAGES = {
    INTERNAL_ERR: "Internal Server Error!",
    INCORRECT_U_P: "Incorrect Username or Password",
    INCORRECT_P: "Incorrect Password",
    INCORRECT_REPEAT: "Repeat Password Correctly",
    USED_USERNAME: "Username Already Exists"
};


function login() {
    let uname = byId("log-uname").value.trim();
    let password = byId("log-password").value.trim();
    let output = byId("output-error");
    output.innerHTML = "";

    Ajax("post", "/login-check", {
        "uname": uname,
        "password": password
    }).then(function(responseText) {
        let result = parseInt(responseText);
        if(result == -1) {
            console.error(MESSAGES.INTERNAL_ERR);
        } else if(result == 2) {
            output.innerHTML = MESSAGES.INCORRECT_U_P;
        } else if(result == 1) {
            output.innerHTML = MESSAGES.INCORRECT_P;
        } else if(result == 0) {
            byId("login-form").submit();
        }
    }).catch((err) => {
        console.error(err);
    });
}

function register() {
    let password = byId("reg-password").value.trim();
    let password_rep = byId("reg-password-rep").value.trim();
    let output = byId("output-error");
    output.innerHTML = "";

    if(password !== password_rep) {
        output.innerHTML = MESSAGES.INCORRECT_REPEAT;
    } else {
        let uname = byId("reg-uname").value.trim();
        Ajax("post", "/register-check", {"uname": uname}).then(function(responseText) {
            let result = parseInt(responseText);
            if(result == -1) {
                console.error(MESSAGES.INTERNAL_ERR);
            } else if(result == 1) {
                output.innerHTML = MESSAGES.USED_USERNAME;
            } else if(result == 0) {
                byId("register-form").submit();
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}

function showSpace(type) {
    // true = Sign Up, false = Log In
    byClass("log-space")[0].style.display = (type)? "none": "block";
    byClass("reg-space")[0].style.display = (type)? "block": "none";
    byId("output-error").innerHTML = "";
}
