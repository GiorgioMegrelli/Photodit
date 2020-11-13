const NAMED_COLORS = {
    "000080": ["Navy"],
    "00008B": ["Dark Blue"],
    "0000CD": ["Medium Blue"],
    "0000FF": ["Blue"],
    "006400": ["Dark Green"],
    "008000": ["Green"],
    "008080": ["Teal"],
    "008B8B": ["Dark Cyan"],
    "00BFFF": ["Deep Sky Blue"],
    "00CED1": ["Dark Turquoise"],
    "00FA9A": ["Medium Spring Green"],
    "00FF00": ["Lime"],
    "00FF7F": ["Spring Green"],
    "00FFFF": ["Aqua", "Cyan"],
    "191970": ["Midnight Blue"],
    "1E90FF": ["Dodger Blue"],
    "20B2AA": ["Light Sea Green"],
    "228B22": ["Forest Green"],
    "2E8B57": ["Sea Green"],
    "2F4F4F": ["Dark Slate Grey"],
    "32CD32": ["Lime Green"],
    "3CB371": ["Medium Sea Green"],
    "40E0D0": ["Turquoise"],
    "4169E1": ["Royal Blue"],
    "4682B4": ["Steel Blue"],
    "483D8B": ["Dark Slate Blue"],
    "48D1CC": ["Medium Turquoise"],
    "4B0082": ["Indigo"],
    "556B2F": ["Dark Olive Green"],
    "5F9EA0": ["Cadet Blue"],
    "6495ED": ["Cornflower Blue"],
    "66CDAA": ["Medium Aquamarine"],
    "696969": ["Dim Grey"],
    "6A5ACD": ["Slate Blue"],
    "6B8E23": ["Olive Drab"],
    "708090": ["Slate Grey"],
    "778899": ["Light Slate Grey"],
    "7B68EE": ["Medium Slate Blue"],
    "7CFC00": ["Lawn Green"],
    "7FFF00": ["Chartreuse"],
    "7FFFD4": ["Aquamarine"],
    "800000": ["Maroon"],
    "800080": ["Purple"],
    "808000": ["Olive"],
    "808080": ["Grey"],
    "87CEEB": ["SkyBlue"],
    "87CEFA": ["Light Sky Blue"],
    "8A2BE2": ["Blue Violet"],
    "8B0000": ["Dark Red"],
    "8B008B": ["Dark Magenta"],
    "8B4513": ["Saddle Brown"],
    "8FBC8F": ["Dark Sea Green"],
    "90EE90": ["Light Green"],
    "9370D8": ["Medium Purple"],
    "9400D3": ["Dark Violet"],
    "98FB98": ["Pale Green"],
    "9932CC": ["Dark Orchid"],
    "9ACD32": ["Yellow Green"],
    "A0522D": ["Sienna"],
    "A52A2A": ["Brown"],
    "A9A9A9": ["Dark Grey"],
    "ADD8E6": ["Light Blue"],
    "ADFF2F": ["Green Yellow"],
    "AFEEEE": ["Pale Turquoise"],
    "B0C4DE": ["Light Steel Blue"],
    "B0E0E6": ["Powder Blue"],
    "B22222": ["Fire Brick"],
    "B8860B": ["Dark Goldenrod"],
    "BA55D3": ["Medium Orchid"],
    "BC8F8F": ["Rosy Brown"],
    "BDB76B": ["Dark Khaki"],
    "C0C0C0": ["Silver"],
    "C71585": ["Medium Violet Red"],
    "CD5C5C": ["Indian Red"],
    "CD853F": ["Peru"],
    "D2691E": ["Chocolate"],
    "D2B48C": ["Tan"],
    "D3D3D3": ["Light Grey"],
    "D87093": ["Pale Violet Red"],
    "D8BFD8": ["Thistle"],
    "DA70D6": ["Orchid"],
    "DAA520": ["Goldenrod"],
    "DC143C": ["Crimson"],
    "DCDCDC": ["Gainsboro"],
    "DDA0DD": ["Plum"],
    "DEB887": ["Burly Wood"],
    "E0FFFF": ["Light Cyan"],
    "E6E6FA": ["Lavender"],
    "E9967A": ["Dark Salmon"],
    "EE82EE": ["Violet"],
    "EEE8AA": ["Pale Goldenrod"],
    "F08080": ["Light Coral"],
    "F0E68C": ["Khaki"],
    "F0F8FF": ["Alice Blue"],
    "F0FFF0": ["Honey Dew"],
    "F0FFFF": ["Azure"],
    "F4A460": ["Sandy Brown"],
    "F5DEB3": ["Wheat"],
    "F5F5DC": ["Beige"],
    "F5F5F5": ["White Smoke"],
    "F5FFFA": ["Mint Cream"],
    "F8F8FF": ["Ghost White"],
    "FA8072": ["Salmon"],
    "FAEBD7": ["Antique White"],
    "FAF0E6": ["Linen"],
    "FAFAD2": ["Light Goldenrod Yellow"],
    "FDF5E6": ["Old Lace"],
    "FF0000": ["Red"],
    "FF00FF": ["Fuchsia", "Magenta"],
    "FF1493": ["Deep Pink"],
    "FF4500": ["Orange Red"],
    "FF6347": ["Tomato"],
    "FF69B4": ["Hot Pink"],
    "FF7F50": ["Coral"],
    "FF8C00": ["Darkorange"],
    "FFA07A": ["Light Salmon"],
    "FFA500": ["Orange"],
    "FFB6C1": ["Light Pink"],
    "FFC0CB": ["Pink"],
    "FFD700": ["Gold"],
    "FFDAB9": ["Peach Puff"],
    "FFDEAD": ["Navajo White"],
    "FFE4B5": ["Moccasin"],
    "FFE4C4": ["Bisque"],
    "FFE4E1": ["Misty Rose"],
    "FFEBCD": ["Blanched Almond"],
    "FFEFD5": ["Papaya Whip"],
    "FFF0F5": ["Lavender Blush"],
    "FFF5EE": ["Sea Shell"],
    "FFF8DC": ["Cornsilk"],
    "FFFACD": ["Lemon Chiffon"],
    "FFFAF0": ["Floral White"],
    "FFFAFA": ["Snow"],
    "FFFF00": ["Yellow"],
    "FFFFE0": ["Light Yellow"],
    "FFFFF0": ["Ivory"]
};

const HEX = Object.keys(NAMED_COLORS);

const COOKIE_NAME = "guess-color-max-score";
const MAX_AGE = "max-age";
const HALF_YEAR = 60*60*24*183;
let rightChoice;
let maxScore;
let thisScore = 0;
let interval = undefined;


/* Color Choosing */
function getColors() {
    const randomIndex = function(bound) {
        return Math.floor(Math.random()*bound);
    };
    const len = HEX.length;
    let indexes = [];

    indexes[0] = randomIndex(len);
    while(true) {
        indexes[1] = randomIndex(len);
        if(indexes[1] != indexes[0]) break;
    }
    while(true) {
        indexes[2] = randomIndex(len);
        if(indexes[2] != indexes[0] && indexes[2] != indexes[1]) break;
    }
    return [indexes, randomIndex(indexes.length)];
}

/* Cookie Worker */
function getMaxCounter() {
    let cookie = document.cookie.trim();
    if(cookie !== "") {
        let cookies = cookie.split(";");
        for(let i = 0; i<cookies.length; i++) {
            let pair = cookies[i].split("=");
            if(pair[0] === COOKIE_NAME) {
                return parseInt(pair[1]);
            }
        }
    }
    return 0;
}
function setMaxCounter(val) {
    let cookie = document.cookie.trim();
    let cookies = [];
    let addCookie = true;
    let addMaxAge = true;
    if(cookie !== "") {
        cookie.split(";").forEach(function(elem) {
            cookies.push(elem.split("="));
        });
        for(let i = 0; i<cookies.length; i++) {
            let cookieKey = cookies[i][0].trim();
            if(cookieKey === MAX_AGE) {
                cookies[i][1] = HALF_YEAR.toString();
                addMaxAge = false;
            } else if(cookieKey === COOKIE_NAME) {
                let value = parseInt(cookies[i][1].trim()) + 1;
                cookies[i][1] = value.toString();
                addCookie = false;
                break;
            } 
        }
    }
    if(addCookie) {
        cookies.push([COOKIE_NAME, "1"]);
    }
    if(addMaxAge) {
        cookies.push([MAX_AGE, HALF_YEAR.toString()]);
    }
    let newCookies = [];
    cookies.forEach(function(elem) {
        newCookies.push(elem.join("="));
    });
    document.cookie = newCookies.join(";");
}

/* Gaming */
function userChoose(index) {
    index--;
    if(index >= 0 && index < 3) {
        let buttons = byClass("game-choice-box");
        buttons[index].style.backgroundColor = "#FF2800";
        buttons[index].style.color = "#FFFFFF";
        buttons[rightChoice].style.backgroundColor = "#057A5F";
        buttons[rightChoice].style.color = "#FFFFFF";
        for(let i = 0; i<buttons.length; i++) {
            buttons[i].disabled = true;
        }
        if(index == rightChoice) {
            thisScore++;
            byId("game-score-cur").innerHTML = thisScore;
            if(thisScore > maxScore) {
                maxScore = thisScore;
                byId("game-score-max").innerHTML = thisScore;
                setMaxCounter(maxScore);
            }
        }
        byClass("game-restart")[0].style.display = "block";
        let counter = 5;
        let timer = byId("timer-counter");
        interval = setInterval(function() {
            counter--;
            timer.innerHTML = counter;
            if(counter == 0) {
                clearInterval(interval);
                interval = undefined;
                gaming();
            }
        }, 1000);
    }
}

function showData(indexes, choice) {
    let buttons = byClass("game-choice-box");
    for(let i = 0; i<buttons.length; i++) {
        let names = NAMED_COLORS[HEX[indexes[i]]];
        if(names.length == 1) {
            buttons[i].innerHTML = names[0];
        } else {
            buttons[i].innerHTML = names.join(" / ");
        }
        buttons[i].style.backgroundColor = "#ECECEC";
        buttons[i].style.color = "#000000";
        buttons[i].disabled = false;
        byClass("game-restart")[0].style.display = "none";
    }
    byId("game-correct-back").style.backgroundColor = "#" + HEX[indexes[choice]];
    byId("timer-counter").innerHTML = 5;
}

function gaming() {
    let result, indexes, choice;
    result = getColors();
    indexes = result[0];
    choice = result[1];
    rightChoice = choice;
    showData(indexes, choice);
}

function restart() {
    if(interval !== undefined) {
        clearInterval(interval);
        interval = undefined;
    }
    gaming();
}

function byId(id) {
    return document.getElementById(id);
}
function byClass(cls) {
    return document.getElementsByClassName(cls);
}


window.onload = function() {
    maxScore = getMaxCounter();
    byId("game-score-max").innerHTML = maxScore;
    gaming();
}
