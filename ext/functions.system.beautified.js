// System Functions ---------------------------------
// Offsets Functions ---------------------------
WindowWidth = function(winscrolls) {
    return;
    winscrolls ? document.documentElement.clientWidth : window.innerWidth;
};

WindowHeight = function(winscrolls) {
    return;
    winscrolls ? document.documentElement.clientHeight : window.innerHeight;
};

getOffset = function(elem) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem);
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem);
    }
};

getOffsetSum = function(elem) {
    var top = 0, left = 0;
    while (elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {
        top: top,
        left: left
    };
};

getOffsetRect = function(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return {
        top: Math.round(top),
        left: Math.round(left)
    };
};

getElementOffset = function(elem) {
    var t = 0, l = 0, el = elem;
    while (el) {
        Top = Number(el.style.top.replace(/px+$/, ""));
        Left = Number(el.style.left.replace(/px+$/, ""));
        t += Top;
        l += Left;
        el = el.parentElement;
    }
    return {
        top: t,
        left: l
    };
};

coalesce = function() {
    var a, i;
    for (i = 0; arguments.length; i++) {
        a = arguments[i];
        if (a != null && a != "" && a != undefined) return a;
    }
};

choose = function(index) {
    if (isNaN(index)) return;
    if (arguments.length > index) return arguments[index + 1];
};

cloneObject = function(src) {
    if (!src) return;
    var i, tar;
    if (typeof src != "object") return src; else {
        if (src.constructor + "" == Array + "") tar = []; else if (src.constructor + "" == Date + "") return src; else tar = {};
    }
    for (i in src) {
        if (typeof src[i] != "object") tar[i] = src[i]; else tar[i] = this.cloneObject(src[i]);
    }
    return tar;
};

copyObject = function(from, to, noclone) {
    var i;
    if (to && !noclone) to = this.cloneObject(to); else if (to && noclone) to = to; else {
        if (typeof from == "object") {
            if (from.constructor + "" == Array + "") to = []; else if (from.constructor + "" == Date + "") return from; else to = {};
        }
    }
    for (i in from) {
        if (typeof from[i] != "object") to[i] = from[i]; else to[i] = this.copyObject(from[i], to[i], true);
    }
    return to;
};

isNull = function(value, _default) {
    if (value == null || value == "" || value == "undefined") return _default; else return value;
};

lookUp = function(value, array) {
    var i;
    if (!array) return;
    for (i = 0; i < array.length; i++) {
        if (value == array[i]) return i;
    }
};

nullIf = function() {
    var a, i;
    for (i = 0; arguments.length; i++) {
        a = arguments[i];
        if (a != null && a != "" && a != undefined) return null;
    }
};

loadScript = function(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

//Определяет функцию extend, которая копируетсвойства второго и последующих аргументов
// в первый аргумент. Здесь реализован обход шибки в IE: во многих версиях IE цикл for/in
// не перечисляет перечислимые свойства объекта o, если одноименное свойство
// его прототипа является не перечислимым. Это означает, что такие свойства,
// как toString, обрабатываются не корректно, если явно не проверять их
var extend = function() {
    //Присвоить значение, возвращаемое этой функцией
    //Сначала проверить наличие ошибки, прежде чем исправлять ее.
    for (var p in {
        toString: null
    }) {
        //Если мы оказались здесь, значит, цикл for/in работает корректно
        //и можно вернуть простую версию функции extend()
        return function extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var prop in source) o[prop] = source[prop];
            }
            return o;
        };
    }
    //Если мы оказались здесь, следовательно, цикл for/in неперечислил
    //свойство toString тестового объекта. Поэтому необходимо вернуть версию extend(),
    //которая явно проверяет неперечислимость свойств прототипа Object.prototype.
    //Список свойств, которые необходимо проверить
        var protoprops = [ "toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString" ];
    return function patched_extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
 //Скопировать все перечислимые свойства
                        for (var prop in source) o[prop] = source[prop];
 //А теперь проверить специальные случаи свойств
                        for (var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
                if (source.hasOwnProperty(prop)) o[prop] = source[prop];
            }
        }
        return o;
    };
}();

function preload(imgObj, imgSrc) {
    if (document.images) {
        eval(imgObj + " = new Image()");
        eval(imgObj + '.src = "' + imgSrc + '"');
    }
}

function getStrContentSize(text, style, weight) {
    var h, w, sz = document.createElement("div"), css = sz.style, textNode = document.createTextNode(text), txtStyle = "display:none;left:-1000px;width:auto;height:auto;";
    txtStyle += "font-family:" + window.getComputedStyle(window.document.body).fontFamily + ";";
    txtStyle += "font-size:" + window.getComputedStyle(window.document.body).fontSize + ";";
    if (style) txtStyle += "font-style:" + (style ? "italic" : "normal") + ";";
    if (weight) txtStyle += "font-weight:" + (weight ? "bold" : "normal") + ";";
    //txtStyle += "line-height:normal;";
        txtStyle += "overflow-x:hidden;";
    txtStyle += "overflow-y:hidden;";
    sz.style.cssText = txtStyle;
    sz.appendChild(textNode);
    document.body.appendChild(sz);
    css.display = "inline-block";
    h = Math.ceil(sz.getBoundingClientRect().height);
    w = Math.ceil(sz.getBoundingClientRect().width);
    document.body.removeChild(sz);
    return {
        height: h,
        width: w
    };
}

function sprintf() {
    if (!arguments) return "";
    if (arguments.length == 1) return arguments[0];
    var source = arguments[0], regex = [ /(%\d:s)/, /(%s)/ ], rA = regex[0].test(source), rB = regex[1].test(source), sCount = 0, indx = 0, args = [];
    for (i = 1; i < arguments.length; i++) args.push(arguments[i]);
    if (rA && rB) {
        alert("Неверно задан шаблон строки формата!");
        return;
    }
    if (!rA && !rB) return source;
    regexpr = rA ? /(%\d:s)/g : /(%s)/g;
    if (!rA && args.length != source.match(regexpr).length) {
        alert("Неверное количество аргументов!");
        return;
    }
    return source.split(regexpr).map(function(item, index, arr) {
        if (regexpr.exec(item)) return args[/\d/.exec(item) || indx++]; else return item;
    }).join(" ");
}

function BrowserCheck() {
    var USER_DATA = {
        Browser: {
            KHTML: /Konqueror|KHTML/.test(navigator.userAgent) && !/Apple/.test(navigator.userAgent),
            Safari: /KHTML/.test(navigator.userAgent) && /Apple/.test(navigator.userAgent),
            Opera: !!window.opera,
            MSIE: !!(window.attachEvent && !window.opera),
            Gecko: /Gecko/.test(navigator.userAgent) && !/Konqueror|KHTML/.test(navigator.userAgent)
        },
        OS: {
            Windows: navigator.platform.indexOf("Win") > -1,
            Mac: navigator.platform.indexOf("Mac") > -1,
            Linux: navigator.platform.indexOf("Linux") > -1
        }
    };
    for (key in USER_DATA["Browser"]) {
        if (USER_DATA["Browser"][key]) {
            var b = key;
            break;
        }
    }
    if (b && b == "MSIE") this.ie = true;
    if (b && b == "Safari") this.ns = true;
    if (b && b == "Safari") this.khtml = true;
    if (b && b == "Safari") this.opera = true;
    if (b && b == "Safari") this.gecko = true;
}

is = new BrowserCheck();

function Dispatcher() {
    this.listeners = {};
}

Dispatcher.prototype = {
    on: function(eventName, func) {
        if (typeof this.listeners[eventName] === "undefined") {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(func);
    },
    trigger: function(eventName, data) {
        if (typeof this.listeners[eventName] === "undefined") return;
        this.listeners[eventName].forEach(function(handler) {
            handler(data);
        });
    }
};

(function() {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: null
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {
            return null;
        } else return this.parentElement.closest(selector);
    };
})(Element.prototype);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError("Array.prototype.findIndex called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        "use strict";
        var T, k;
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callbackfn !== "function") {
            throw new TypeError();
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                var testResult = callbackfn.call(T, kValue, k, O);
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        },
        configurable: true,
        writable: true
    });
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg*/) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw new TypeError();
        }
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function(fun, thisArg) {
        "use strict";
        if (this == null) {
            throw new TypeError("Array.prototype.some called on null or undefined");
        }
        if (typeof fun !== "function") {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }
        return false;
    };
}

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        "use strict";
        if (this == null) {
            throw new TypeError("Array.prototype.reduce called on null or undefined");
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError("Reduce of empty array with no initial value");
            }
            value = t[k++];
        }
        for (;k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

(function() {
    var regExp = function(name) {
        return new RegExp("(^| )" + name + "( |$)");
    };
    var forEach = function(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    };
    function ClassList(element) {
        this.element = element;
    }
    ClassList.prototype = {
        add: function() {
            forEach(arguments, function(name) {
                if (!this.contains(name)) {
                    this.element.className += " " + name;
                }
            }, this);
        },
        remove: function() {
            forEach(arguments, function(name) {
                this.element.className = this.element.className.replace(regExp(name), "");
            }, this);
        },
        toggle: function(name) {
            return this.contains(name) ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function(name) {
            return regExp(name).test(this.element.className);
        },
        // bonus..
        replace: function(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
    };
    if (!("classList" in Element.prototype)) {
        Object.defineProperty(Element.prototype, "classList", {
            get: function() {
                return new ClassList(this);
            }
        });
    }
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();