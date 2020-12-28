function byId(id) {
    return document.getElementById(id);
}

function byClass(clName) {
    return document.getElementsByClassName(clName);
}

function byTag(tag) {
    return document.getElementsByTagName(tag);
}

function createElement(tag, className = undefined) {
    let node = document.createElement(tag);
    if(className !== undefined) {
        node.className = className;
    }
    return node;
}

function createTextNode(value) {
    return document.createTextNode(value);
}

function createDiv(className = undefined) {
    return createElement("div", className);
}

function createAnchor(href, className = undefined) {
    let a = createElement("a", className);
    a.href = href;
    return a;
}

function _createTextWithClass(tag, className, text) {
    let elem = createElement(tag, className);
    elem.appendChild(createTextNode(text));
    return elem;
}

function createParagraph(className, text = "") {
    return _createTextWithClass("p", className, text);
}

function createIcon(className, text = "") {
    return _createTextWithClass("i", className, text);
}

function appendChildsArray(item, array = []) {
    array.forEach((subElem) => {
        item.appendChild(subElem);
    });
}

function getUrlId() {
    let url = window.location.href || document.URL;
    let splitUrl = url.split("/");
    if(splitUrl.length <= 1) {
        return undefined;
    }
    let imageIdStr = splitUrl[splitUrl.length - 1].trim();
    let imageId = parseInt(imageIdStr);
    return (isNaN(imageId))? -1: imageId;
}

function Ajax(method, url, args = {}) {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status === 200) {
                    resolve(this.responseText);
                } else {
                    reject(Error(request.status));
                }
            }
        };
        request.open(method.toUpperCase(), url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(Object.keys(args).map(function(key) {
            return key + "=" + args[key];
        }).join("&"));
    });
}
