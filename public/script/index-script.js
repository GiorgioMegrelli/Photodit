window.onload = function winOnload() {
    let parentNode = document.getElementsByClassName("header")[0];
    let listElems = parentNode.getElementsByTagName("li");
    for(let i = 0; i<listElems.length; i++) {
        let thisId = listElems[i].id;
        listElems[i].setAttribute("onmouseenter", "headerStyle('" + thisId + "')");
        listElems[i].setAttribute("onmouseleave", "headerStyleClear('" + thisId + "')");
    }
};


function headerStyle(id) {
    let rgb = randomColor(true);
    document.getElementById(id).style.background = "#F0F0F0";
    document.getElementsByClassName("header")[0].style.background = "#" + RGBtoHEX(rgb.r, rgb.g, rgb.b);
}

function headerStyleClear(id) {
    document.getElementById(id).style.background = "#EEEEEE";
    document.getElementsByClassName("header")[0].style.background = "#F0F0F0";
}


const headerColors = [
    "336699"
];
