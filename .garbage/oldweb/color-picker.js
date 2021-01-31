const namedColors = {
    "000000": ["Black"],
    "000080": ["Navy"],
    "00008B": ["DarkBlue"],
    "0000CD": ["MediumBlue"],
    "0000FF": ["Blue"],
    "006400": ["DarkGreen"],
    "008000": ["Green"],
    "008080": ["Teal"],
    "008B8B": ["DarkCyan"],
    "00BFFF": ["DeepSkyBlue"],
    "00CED1": ["DarkTurquoise"],
    "00FA9A": ["MediumSpringGreen"],
    "00FF00": ["Lime"],
    "00FF7F": ["SpringGreen"],
    "00FFFF": ["Aqua", "Cyan"],
    "191970": ["MidnightBlue"],
    "1E90FF": ["DodgerBlue"],
    "20B2AA": ["LightSeaGreen"],
    "228B22": ["ForestGreen"],
    "2E8B57": ["SeaGreen"],
    "2F4F4F": ["DarkSlateGrey", "DarkSlateGray"],
    "32CD32": ["LimeGreen"],
    "3CB371": ["MediumSeaGreen"],
    "40E0D0": ["Turquoise"],
    "4169E1": ["RoyalBlue"],
    "4682B4": ["SteelBlue"],
    "483D8B": ["DarkSlateBlue"],
    "48D1CC": ["MediumTurquoise"],
    "4B0082": ["Indigo"],
    "556B2F": ["DarkOliveGreen"],
    "5F9EA0": ["CadetBlue"],
    "6495ED": ["CornflowerBlue"],
    "66CDAA": ["MediumAquaMarine"],
    "696969": ["DimGrey", "DimGray"],
    "6A5ACD": ["SlateBlue"],
    "6B8E23": ["OliveDrab"],
    "708090": ["SlateGrey", "SlateGray"],
    "778899": ["LightSlateGrey", "LightSlateGray"],
    "7B68EE": ["MediumSlateBlue"],
    "7CFC00": ["LawnGreen"],
    "7FFF00": ["Chartreuse"],
    "7FFFD4": ["Aquamarine"],
    "800000": ["Maroon"],
    "800080": ["Purple"],
    "808000": ["Olive"],
    "808080": ["Grey", "Gray"],
    "87CEEB": ["SkyBlue"],
    "87CEFA": ["LightSkyBlue"],
    "8A2BE2": ["BlueViolet"],
    "8B0000": ["DarkRed"],
    "8B008B": ["DarkMagenta"],
    "8B4513": ["SaddleBrown"],
    "8FBC8F": ["DarkSeaGreen"],
    "90EE90": ["LightGreen"],
    "9370D8": ["MediumPurple"],
    "9400D3": ["DarkViolet"],
    "98FB98": ["PaleGreen"],
    "9932CC": ["DarkOrchid"],
    "9ACD32": ["YellowGreen"],
    "A0522D": ["Sienna"],
    "A52A2A": ["Brown"],
    "A9A9A9": ["DarkGrey", "DarkGray"],
    "ADD8E6": ["LightBlue"],
    "ADFF2F": ["GreenYellow"],
    "AFEEEE": ["PaleTurquoise"],
    "B0C4DE": ["LightSteelBlue"],
    "B0E0E6": ["PowderBlue"],
    "B22222": ["FireBrick"],
    "B8860B": ["DarkGoldenRod"],
    "BA55D3": ["MediumOrchid"],
    "BC8F8F": ["RosyBrown"],
    "BDB76B": ["DarkKhaki"],
    "C0C0C0": ["Silver"],
    "C71585": ["MediumVioletRed"],
    "CD5C5C": ["IndianRed"],
    "CD853F": ["Peru"],
    "D2691E": ["Chocolate"],
    "D2B48C": ["Tan"],
    "D3D3D3": ["LightGrey", "LightGray"],
    "D87093": ["PaleVioletRed"],
    "D8BFD8": ["Thistle"],
    "DA70D6": ["Orchid"],
    "DAA520": ["GoldenRod"],
    "DC143C": ["Crimson"],
    "DCDCDC": ["Gainsboro"],
    "DDA0DD": ["Plum"],
    "DEB887": ["BurlyWood"],
    "E0FFFF": ["LightCyan"],
    "E6E6FA": ["Lavender"],
    "E9967A": ["DarkSalmon"],
    "EE82EE": ["Violet"],
    "EEE8AA": ["PaleGoldenRod"],
    "F08080": ["LightCoral"],
    "F0E68C": ["Khaki"],
    "F0F8FF": ["AliceBlue"],
    "F0FFF0": ["HoneyDew"],
    "F0FFFF": ["Azure"],
    "F4A460": ["SandyBrown"],
    "F5DEB3": ["Wheat"],
    "F5F5DC": ["Beige"],
    "F5F5F5": ["WhiteSmoke"],
    "F5FFFA": ["MintCream"],
    "F8F8FF": ["GhostWhite"],
    "FA8072": ["Salmon"],
    "FAEBD7": ["AntiqueWhite"],
    "FAF0E6": ["Linen"],
    "FAFAD2": ["LightGoldenRodYellow"],
    "FDF5E6": ["OldLace"],
    "FF0000": ["Red"],
    "FF00FF": ["Fuchsia", "Magenta"],
    "FF1493": ["DeepPink"],
    "FF4500": ["OrangeRed"],
    "FF6347": ["Tomato"],
    "FF69B4": ["HotPink"],
    "FF7F50": ["Coral"],
    "FF8C00": ["Darkorange"],
    "FFA07A": ["LightSalmon"],
    "FFA500": ["Orange"],
    "FFB6C1": ["LightPink"],
    "FFC0CB": ["Pink"],
    "FFD700": ["Gold"],
    "FFDAB9": ["PeachPuff"],
    "FFDEAD": ["NavajoWhite"],
    "FFE4B5": ["Moccasin"],
    "FFE4C4": ["Bisque"],
    "FFE4E1": ["MistyRose"],
    "FFEBCD": ["BlanchedAlmond"],
    "FFEFD5": ["PapayaWhip"],
    "FFF0F5": ["LavenderBlush"],
    "FFF5EE": ["SeaShell"],
    "FFF8DC": ["Cornsilk"],
    "FFFACD": ["LemonChiffon"],
    "FFFAF0": ["FloralWhite"],
    "FFFAFA": ["Snow"],
    "FFFF00": ["Yellow"],
    "FFFFE0": ["LightYellow"],
    "FFFFF0": ["Ivory"],
    "FFFFFF": ["White"]
};


function randomColor(rule) {
    let randVal = function randVal() {
        return Math.floor(Math.random()*256)
    };
    return {r: randVal(), g: randVal(), b: randVal()};
}


function RGBtoHEX(rgb) {
    let r16 = ((rgb.r <= 15)? "0": "") + rgb.r.toString(16);
    let g16 = ((rgb.g <= 15)? "0": "") + rgb.g.toString(16);
    let b16 = ((rgb.b <= 15)? "0": "") + rgb.b.toString(16);
    return (r16 + g16 + b16).toUpperCase();
}

function HEXtoRGB(hex) {
    if(hex.charAt(0) === "#") {
        hex = hex.substring(1);
    }
    if(hex.length != 6) {
        throw "Invalid HEX Format";
    }
    let hexes = [];
    for(let i = 0; i<6; i += 2) {
        hexes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return {r: hexes[0], g: hexes[1], b: hexes[2]};
}

function RGBtoCMYK(rgb) {
    let c, m, y, k, r, g, b;
    r = rgb.r/255;
    g = rgb.g/255;
    b = rgb.b/255;

    k = Math.min( 1 - r, 1 - g, 1 - b );
    c = (1 - r - k)/(1 - k);
    m = (1 - g - k)/(1 - k);
    y = (1 - b - k)/(1 - k);

    c = Math.round(c*100);
    m = Math.round(m*100);
    y = Math.round(y*100);
    k = Math.round(k*100);

    return {c: c, m: m, y: y, k: k};
}

function CMYKtoRGB(cmyk) {
    let r, g, b, c, m, y, k;
    c = cmyk.c/100;
    m = cmyk.m/100;
    y = cmyk.y/100;
    k = cmyk.k/100;

    r = 1 - Math.min(1, c*(1 - k) + k);
	g = 1 - Math.min(1, m*(1 - k) + k);
	b = 1 - Math.min(1, y*(1 - k) + k);

    r = Math.round(r*255);
    g = Math.round(g*255);
    b = Math.round(b*255);

    return {r: r, g: g, b: b};
}

function RGBtoHSL(rgb) {
    let r, g, b;
    r = rgb.r/255;
    g = rgb.g/255;
    b = rgb.b/255;

    let cmax = Math.max(r, g, b);
    let cmin = Math.min(r, g, b);
    let delta = cmax - cmin;

    let h = 0, s = 0, l = 0;

    if(delta == 0) {
        h = 0;
    } else if(cmax == r) {
        h = ((g - b)/delta)%6;
    } else if(cmax == g) {
        h = (b - r)/delta + 2;
    } else {
        h = (r - g)/delta + 4;
    }

    h = Math.round(h*60);

    if(h < 0) h += 360

    l = (cmax + cmin)/2;

    if(delta != 0) {
        s = delta/(1 - Math.abs(2*l - 1));
    }

    s = Math.round(Math.abs(s*100));
    l = Math.round(Math.abs(l*100));

    return {h: h, s: s, l: l};
}

function HSLtoRGB(hsl) {
    let h = hsl.h;
    let s = hsl.s;
    let l = hsl.l;

    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2*l - 1)) * s;
    let x = c*(1 - Math.abs((h/60)%2 - 1));
    let m = l - c/2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (h < 120) {
        r = x; g = c; b = 0;
    } else if (h < 180) {
        r = 0; g = c; b = x;
    } else if (h < 240) {
        r = 0; g = x; b = c;
    } else if (h < 300) {
        r = x; g = 0; b = c;
    } else if (h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m)*255);
    g = Math.round((g + m)*255);
    b = Math.round((b + m)*255);

    return {r: r, g: g, b: b};
}

function RGBStr(rgb) {
    return (rgb.r + ", " + rgb.g + ", " + rgb.b);
}

function CMYKStr(cmyk) {
    return (cmyk.c + "%, " + cmyk.m  + "%, " + cmyk.y  + "%, " + cmyk.k  + "%");
}

function HSLStr(hsl) {
    return (hsl.h + ", " + hsl.s + "%, " + hsl.l + "%");
}
