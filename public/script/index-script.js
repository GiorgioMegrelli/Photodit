window.onload = function winOnload() {
    colorPickerBackground();
};

function colorPickerBackground() {
    let rgb = randomColor();
    let hex = RGBtoHEX(rgb);
    let cmyk = RGBtoCMYK(rgb);
    let hsl = RGBtoHSL(rgb);
    let named = namedColors[hex];
    byClass("color-picker")[0].style.background = "#" + hex;
    byId("c-p-output-rgb").innerHTML = RGBStr(rgb);
    byId("c-p-output-hex").innerHTML = "#" + hex;
    byId("c-p-output-cmyk").innerHTML = CMYKStr(cmyk);
    byId("c-p-output-hsl").innerHTML = HSLStr(hsl);
    byId("c-p-output-ps").innerHTML = hex;
    byId("c-p-output-named").innerHTML = ((named === undefined)? "Bla Bla": named);
}

function copyOutput(id, dataType) {
    clearTextSelection();

    const RGB = 1, HEX = 2, CMYK = 3, HSL = 4, PS = 5, NAMED = 6;
    let element = byId(id);
    if(element == null) return;

    let value = element.innerHTML.trim();
    let toSave;
    switch(dataType) {
        case RGB:
            toSave = ("rgb(" + value + ")");
            break;
        case HEX:
            toSave = value;
            break;
        case CMYK:
            toSave = ("cmyk(" + value + ")");
            break;
        case HSL:
            toSave = ("hsl(" + value + ")");
            break;
        case PS:
            toSave = value;
            break;
        case NAMED:
            if(value === "") return;
            toSave = value;
            break;
        default: return;
    }
    navigator.clipboard.writeText(toSave);
}

function clearTextSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

function byId(id) {
    return document.getElementById(id);
}
function byClass(clss) {
    return document.getElementsByClassName(clss);
}



/*
let parentNode = document.getElementsByClassName("header")[0];
let listElems = parentNode.getElementsByTagName("li");
for(let i = 0; i<listElems.length; i++) {
    let thisId = listElems[i].id;
    listElems[i].setAttribute("onmouseenter", "headerStyle('" + thisId + "')");
    listElems[i].setAttribute("onmouseleave", "headerStyleClear('" + thisId + "')");
}
function headerStyle(id) {
    document.getElementById(id).style.background = "#F0F0F0";
}
function headerStyleClear(id) {
    document.getElementById(id).style.background = "#EEEEEE";
}
*/
