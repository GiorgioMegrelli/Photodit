function byId(id) {
    return document.getElementById(id);
}

function byClass(clName) {
    return document.getElementsByClassName(clName);
}

function byTag(tag) {
    return document.getElementsByTagName(tag);
}

function createElement(tag, className) {
    let node = document.createElement(tag);
    if(className !== undefined) {
        node.className = className;
    }
    return node;
}
