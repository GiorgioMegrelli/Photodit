function byId(id) {
    return document.getElementById(id);
}
function byClass(clName) {
    return document.getElementsByClassName(clName);
}
function byTag(tag) {
    return document.getElementsByTagName(tag);
}

function createTag(tag, attrs = {}) {
    let element = document.createElement(tag);
    Object.keys(attrs).forEach(function(key) {
        element[key] = attrs[key];
    });
    return element;
}

function createDiv(attrs = {}) {
    return createTag("div", attrs);
}

function createInput(type, attrs = {}) {
    attrs["type"] = type;
    return createTag("input", attrs);
}

function createIcon(className, text, attrs = {}) {
    return createTag("i", Object.assign({}, attrs, {
        className: className,
        innerHTML: text || ""
    }));
}

function createTextNode(value) {
    return document.createTextNode(value);
}

function appendChildsArray(elem, array = []) {
    array.forEach((subElem) => {
        elem.appendChild(subElem);
    });
}

function getUrlId() {
    let url = window.location.href || document.URL;
    let splitUrl = url.split("/");
    if(splitUrl.length <= 1) {
        return -1;
    }
    let idInSplitted = splitUrl[splitUrl.length - 1].trim();
    let idInt = parseInt(idInSplitted);
    return (isNaN(idInt))? -1: idInt;
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
