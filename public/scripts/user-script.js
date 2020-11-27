window.onload = function() {
    fillNumberData1();
    fillNumberData2();
};

function fillNumberData1() {

}

function fillNumberData2() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {}
    };
    xhttp.open("post", "/getFullNumbersPLC", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("userId=");
}
