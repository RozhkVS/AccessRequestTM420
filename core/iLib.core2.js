/**
 * @param {window object} [win] Optional prameter. You could send an IFrame.contentWindow too.
 */
function fixIERangeObject(range, win) { //Only for IE8 and below.
  win = win || window;

  if (!range) return null;
  if (!range.startContainer && win.document.selection) { //IE8 and below

    var _findTextNode = function(parentElement, text) {
      //Iterate through all the child text nodes and check for matches
      //As we go through each text node keep removing the text value (substring) from the beginning of the text variable.
      var container = null,
        offset = -1;
      for (var node = parentElement.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) { //Text node
          var find = node.nodeValue;
          var pos = text.indexOf(find);
          if (pos == 0 && text != find) { //text==find is a special case
            text = text.substring(find.length);
          } else {
            container = node;
            offset = text.length - 1; //Offset to the last character of text. text[text.length-1] will give the last character.
            break;
          }
        }
      }
      //Debug Message
      //alert(container.nodeValue);
      return {
        node: container,
        offset: offset
      }; //nodeInfo
    }

    var rangeCopy1 = range.duplicate(),
      rangeCopy2 = range.duplicate(); //Create a copy
    var rangeObj1 = range.duplicate(),
      rangeObj2 = range.duplicate(); //More copies :P

    rangeCopy1.collapse(true); //Go to beginning of the selection
    rangeCopy1.moveEnd('character', 1); //Select only the first character
    rangeCopy2.collapse(false); //Go to the end of the selection
    rangeCopy2.moveStart('character', -1); //Select only the last character

    //Debug Message
    // alert(rangeCopy1.text); //Should be the first character of the selection
    var parentElement1 = rangeCopy1.parentElement(),
      parentElement2 = rangeCopy2.parentElement();

    //If user clicks the input button without selecting text, then moveToElementText throws an error.
    if (parentElement1 instanceof HTMLInputElement || parentElement2 instanceof HTMLInputElement) {
      return null;
    }
    rangeObj1.moveToElementText(parentElement1); //Select all text of parentElement
    rangeObj1.setEndPoint('EndToEnd', rangeCopy1); //Set end point to the first character of the 'real' selection
    rangeObj2.moveToElementText(parentElement2);
    rangeObj2.setEndPoint('EndToEnd', rangeCopy2); //Set end point to the last character of the 'real' selection

    var text1 = rangeObj1.text; //Now we get all text from parentElement's first character upto the real selection's first character
    var text2 = rangeObj2.text; //Here we get all text from parentElement's first character upto the real selection's last character

    var nodeInfo1 = _findTextNode(parentElement1, text1);
    var nodeInfo2 = _findTextNode(parentElement2, text2);

    //Finally we are here
    range.startContainer = nodeInfo1.node;
    range.startOffset = nodeInfo1.offset;
    range.endContainer = nodeInfo2.node;
    range.endOffset = nodeInfo2.offset + 1; //End offset comes 1 position after the last character of selection.
  }
  return range;
}

function getRangeObject(win) { //Gets the first range object
  win = win || window;
  if (win.getSelection) { // Firefox/Chrome/Safari/Opera/IE9
    try {
      return win.getSelection().getRangeAt(0); //W3C DOM Range Object
    } catch (e) { /*If no text is selected an exception might be thrown*/ }
  } else if (win.document.selection) { // IE8
    var range = win.document.selection.createRange(); //Microsoft TextRange Object
    return fixIERangeObject(range, win);
  }
  return null;
}

function isEmpty(object) {
    return object == null || String(object) == "" || typeof (object) == "undefined" || (typeof (object) == "number" && isNaN(object))
}

function dateDiff(date1, date2, field) {
    if (!isInstance(date1, Date) || !isInstance(date2, Date)) {
        return null
    }
    if (field == null)
        field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null
    }
    if (field <= JST_FIELD_DAY) {
        var div = 1;
        switch (field) {
        case JST_FIELD_SECOND:
            div = MILLIS_IN_SECOND;
            break;
        case JST_FIELD_MINUTE:
            div = MILLIS_IN_MINUTE;
            break;
        case JST_FIELD_HOUR:
            div = MILLIS_IN_HOUR;
            break;
        case JST_FIELD_DAY:
            div = MILLIS_IN_DAY;
            break
        }
        return Math.round((date2.getTime() - date1.getTime()) / div)
    }
    var years = date2.getFullYear() - date1.getFullYear();
    if (field == JST_FIELD_YEAR) {
        return years
    } else if (field == JST_FIELD_MONTH) {
        var months1 = date1.getMonth();
        var months2 = date2.getMonth();
        if (years < 0) {
            months1 += Math.abs(years) * 12
        } else if (years > 0) {
            months2 += years * 12
        }
        return (months2 - months1)
    }
    return null
}

function isInstance(object, clazz) {
    if ((object == null) || (clazz == null)) {
        return false
    }
    if (object instanceof clazz) {
        return true
    }
    if ((clazz == String) && (typeof (object) == "string")) {
        return true
    }
    if ((clazz == Number) && (typeof (object) == "number")) {
        return true
    }
    if ((clazz == Array) && (typeof (object) == "array")) {
        return true
    }
    if ((clazz == Function) && (typeof (object) == "function")) {
        return true
    }
    var base = object.base;
    while (base != null) {
        if (base == clazz) {
            return true
        }
        base = base.base
    }
    return false
}

(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  window.CustomEvent = CustomEvent;
})();

(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {return null}
        else return this.parentElement.closest(selector)
      };
}(Element.prototype));

String.prototype.escapeJSON = function() {
    var result = "";
    for (var i = 0; i < this.length; i++)
    {
        var ch = this[i];
        switch (ch)
        {
            case "\\": ch = "\\\\"; break;
            case String.fromCharCode(34): ch = String.fromCharCode(92,34); break;
            case String.fromCharCode(34): ch = String.fromCharCode(92,34); break;
            case "\&": ch = "\\&"; break;
            case "\t": ch = "\\t"; break;
            case "\n": ch = "\\n"; break;
            case "\r": ch = "\\r"; break;
            case "\b": ch = "\\b"; break;
            case "\f": ch = "\\f"; break;
            case "\v": ch = "\\v"; break;
            default: break;
        }
        result += ch;
    }
    return result;
};

if (!String.prototype.trim) {
  (function() {
    // Вырезаем BOM и неразрывный пробел
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  })();
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (callback, thisArg) {
    for (var i = this.length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };
}
if (!String.prototype.substring) {
  String.prototype.substring = function (start, end) {
    if (end === undefined) {
      end = this.length;
    }
    if (end < 0) {
      end = this.length + end;
    }
    if (start < 0) {
      start = this.length + start;
    }
    end = Math.min(this.length, end);
    var length = end - start;
    if (length < 0) {
      length = 0;
    }
    return this.slice(start, end);
  };
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
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
if (!Array.prototype.sort) {
  Array.prototype.sort = function (compareFunction) {
    for (var i = 0; i < this.length - 1; i++) {
      for (var j = 0; j < this.length - i - 1; j++) {
        if (compareFunction ? compareFunction(this[j], this[j + 1]) > 0 : this[j] > this[j + 1]) {
          const temp = this[j];
          this[j] = this[j + 1];
          this[j + 1] = temp;
        }
      }
    }
    return this;
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
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
if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
    fromIndex = fromIndex >= 0 ? fromIndex : this.length - 1;
    for (var i = fromIndex; i >= 0; i--) {
      if (this[i] === searchElement) return i;
    }
    return -1;
  };
}
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
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
    'use strict';
    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callbackfn !== 'function') {
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
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
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
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';
    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
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
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }
    if (typeof fun !== 'function') {
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
  Array.prototype.reduce = function(callback/*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length >= 2) {
      value = arguments[1];
    } else {
      while (k < len && ! (k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
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
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}
if (!Array.prototype.reverse) {
  Object.defineProperty(Array.prototype, 'reverse', {
    value: function() {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var to = Array(len);
      while(o.length)
        to.push(o.pop());
      return to;
    }
  });
}
if (!Array.prototype.difference) {
  Object.defineProperty(Array.prototype, 'difference', {
    value: function(v) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return o;
      }
      var res = [];
      for (var i = 0; i < len; ++i) {
        if (v.indexOf(o[i])<0) {
           res.push(o[i]);
        }
      }
      return res;
    }
  });
}
if (!Array.prototype.intersect) {
  Object.defineProperty(Array.prototype, 'intersect', {
    value: function(v) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return o;
      }
      var res = [];
      for (var i = 0; i < len; ++i) {
        if (v.indexOf(o[i])>=0) {
           res.push(o[i]);
        }
      }
      return res;
    }
  });
}
(function() {
    var regExp = function(name) {
        return new RegExp('(^| )'+ name +'( |$)');
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
                    this.element.className += ' '+ name;
                }
            }, this);
        },
        remove: function() {
            forEach(arguments, function(name) {
                this.element.className =
                    this.element.className.replace(regExp(name), '');
            }, this);
        },
        toggle: function(name) {
            return this.contains(name)
                ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function(name) {
            return regExp(name).test(this.element.className);
        },
        // bonus..
        replace: function(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
    };
    if (!('classList' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                return new ClassList(this);
            }
        });
    }
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();

var extend = (function() { //Присвоить значение, возвращаемое этой функцией
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
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];
    return function patched_extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]; //Скопировать все перечислимые свойства
            for (var prop in source) o[prop] = source[prop]; //А теперь проверить специальные случаи свойств
            for (var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
               if (source.hasOwnProperty(prop))
                    o[prop] = source[prop];
            }
        }
        return o;
    };
}())

function Set() {
    this.values = {};
    this.n = 0;
    this.add.apply(this, arguments);
}
Set.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
        var val = arguments[i];
        var str = Set._v2s(val);
        if (!this.values.hasOwnProperty(str)) {
            this.values[str] = val;
            this.n++;
        }
    }
    return this;
};
Set.prototype.remove = function() {
    for (var i = 0; i < arguments.length; i++) {
        var str = Set._v2s(arguments[i]);
        if (this.values.hasOwnProperty(str)) {
            delete this.values[str];
            this.n--;
        }
    }
    return this;
};
Set.prototype.contains = function(value) {
    return this.values.hasOwnProperty(Set._v2s(value));
};
Set.prototype.size = function() {
    return this.n;
};
Set.prototype.foreach = function(f, context) {
    for (var s in this.values)
        if (this.values.hasOwnProperty(s))
            f.call(context, this.values[s]);
};
Set._v2s = function(val) {
    switch (val) {
        case undefined:
            return 'u';
        case null:
            return 'n';
        case true:
            return 't';
        case false:
            return 'f';
        default:
            switch (typeof val) {
                case 'number':
                    return '#' + val;
                case 'string':
                    return '"' + val;
                default:
                    return '@' + objectId(val);
            }
    }
    function objectId(o) {
        var prop = "|**objectid**|";
        if (!o.hasOwnProperty(prop)) o[prop] = Set._v2s.next++;
        return o[prop];
    }
};
Set._v2s.next = 100;
extend(Set.prototype, {
    toString: function() {
        var s = "{",
            i = 0;
        this.foreach(function(v) {
            s += ((i++ > 0) ? ", " : "") + v;
        });
        return s + "}";
    },
    toLocaleString: function() {
        var s = "{",
            i = 0;
        this.foreach(function(v) {
            if (i++ > 0) s += ", ";
            if (v == null) s += v;
            else s += v.toLocaleString();
        });
        return s + "}";
    },
    toArray: function() {
        var a = [];
        this.foreach(function(v) {
            a.push(v);
        });
        return a;
    }
});
Set.prototype.toJSON = Set.prototype.toArray;
var constant = (function () {
    ownProp = Object.prototype.hasOwnProperty,
    allowed = {
        string: 1,
        number: 1,
        boolean: 1
    },
    prefix = (Math.random() + "_").slice(2);
    return {
        set: function(name, value) {
            if(this.isDefined(name)) {
                return false;
            }
            if(!ownProp.call(allowed, typeof value)){
                return false;
            }
            constants[prefix + name] = value;
            return true;
        },
        isDefined: function(name){
            return ownProp.call(constants, prefix + name);
        },
        get: function(name){
            if(this.isDefined(name)){
                return constants[prefix + name];
            }
            return null;
        }
    };
}())
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
        Windows: navigator.platform.indexOf('Win') > -1,
        Mac: navigator.platform.indexOf('Mac') > -1,
        Linux: navigator.platform.indexOf('Linux') > -1
      }}

      for(key in USER_DATA['Browser']){
        if(USER_DATA['Browser'][key]){
          var b = key
          break;
        }
      }
      if(b && b == 'MSIE') this.ie = true
      if(b && b == 'Safari') this.ns = true
      if(b && b == 'Safari') this.khtml = true
      if(b && b == 'Safari') this.opera = true
      if(b && b == 'Safari') this.gecko = true
}
is = new BrowserCheck();
function preload(imgObj, imgSrc) {
    if (document.images) {
        eval(imgObj + ' = new Image()');
        eval(imgObj + '.src = "' + imgSrc + '"');
    }
}
function getStrContentSize(text,style,weight){
    var h,w,
        fz = parseInt(window.getComputedStyle(window.document.body).fontSize),
        sz = document.createElement('div'),
        css = sz.style,
        textNode = document.createTextNode(text),
        txtStyle = "display:none;left:-1000px;width:auto;height:auto;";
        txtStyle += "font-family:" + window.getComputedStyle(window.document.body).fontFamily + ";";
        txtStyle += "font-size:" + fz+ "px;";
        if(style)
          txtStyle += "font-style:" + (style ? "italic" : "normal")  + ";";
        if(weight)
          txtStyle += "font-weight:" + (weight ? "bold" : "normal") + ";";
        txtStyle += "line-height:" + (fz + 3) + "px;";
        txtStyle += "overflow-x:hidden;";
        txtStyle += "overflow-y:hidden;";
    sz.style.cssText = txtStyle;
    sz.appendChild(textNode);
    document.body.appendChild(sz);
    css.display = "inline-block";
    h = Math.ceil(sz.getBoundingClientRect().height);
    w = Math.ceil(sz.getBoundingClientRect().width);
    document.body.removeChild(sz);
    return {height:h,width:w};
}
function measureWidth(text, font) {
    var metrics,
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    context.font = font;
    metrics = context.measureText(text);
    return metrics.width;
}
function sprintf(/*...*/){
    if(!arguments) return '';
    if(arguments.length == 1) return arguments[0];
    var source     = arguments[0],
        regex      = [/(%\d:s)/,/(%s)/],
        rA         = regex[0].test(source),
        rB         = regex[1].test(source),
        sCount     = 0,
        indx       = 0,
        args       = [];
    for(i = 1; i < arguments.length; i++)
            args.push(arguments[i]);
    if(rA && rB){
        alert('Неверно задан шаблон строки формата!');
        return;
    }
    if(!rA && !rB)
        return source;
    regexpr = rA ? /(%\d:s)/g : /(%s)/g;
    if(!rA && (args.length != source.match(regexpr).length)){
        alert('Неверное количество аргументов!');
        return;
    }
    return source.split(regexpr).map(function(item,index,arr){//onlyNumbers
        if(regexpr.exec(item))
            return args[(/\d/.exec(item) || indx++)];
        else
            return item;
    }).join('');
}
function getStyle(el,styleProp) {
  var x = document.getElementById(el);
  if (!x) return;
  if (x.currentStyle)
    var y = x.currentStyle[styleProp];
  else if (window.getComputedStyle)
    var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
  return y;
}
function debounce(func, ms) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(function(){func.apply(this, arguments)}, ms);
  };
}
function throttle(func, ms) {
  var isThrottled = false,
    savedArgs,
    savedThis;
  function wrapper() {
    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    func.apply(this, arguments); // (1)
    isThrottled = true;
    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}