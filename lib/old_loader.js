var bootPATH = __CreateJSPath("iLib.js");
var extPATH = "http://tz-dir-web/JS/third-party/iLib";
(function(){var readyBound=false;var bindReady=function(){if(readyBound)return;readyBound=true;if(document.addEventListener)document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);ready()},false);if(window.addEventListener)window.addEventListener("load",ready,false);else window.onload=ready};var isReady=false;var readyList=[];var ready=function(){if(!isReady){isReady=true;if(readyList){var fn_temp=null;while(fn_temp=readyList.shift())fn_temp.call(document);
                readyList=null}}};domReady=function(fn){bindReady();if(isReady)fn.call(document);else readyList.push(fn);return this}})();
loadScript(bootPATH + 'lib/alasql.min.js',function(){
    loadScript(bootPATH + 'lib/treetable.js',function(){
        loadScript(bootPATH + 'dialogWindow.js',function(){
          loadScript(bootPATH + 'iLibGrid.js',function(){
            loadScript(bootPATH + 'vendor/resizilla.umd.js',function(){
                    domReady(init());
            });
          });
        });
    });
});
function loadScript(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState){
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    }
    else{
        script.onload = function(){
            if(callback)
                callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

function __CreateJSPath(js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var getInfSysRoots = function(){
  console.log('in');
    var res,
            connection = new ActiveXObject("ADODB.Connection"),
            rs = new ActiveXObject("ADODB.Recordset"),
        connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
    try{
        connection.Open(connectionstring);
        // rs  = connection.Execute("SELECT * FROM [dirdev].[dbo].[ATB_AccessComponentsDataModel] for json path");
        rs  = connection.Execute("select STRING_AGG(CONVERT(varchar(10),res.InfSysID),',') as expr from (SELECT DISTINCT InfSysID FROM ATB_AccessComponentsSelectView) as res");
        rs.MoveFirst();
        res = rs.fields(0).Value;
    }
    catch(ex) {
    alert(ex.message);
    }
        if(rs.State == 1) rs.Close;
        if(connection.State == 1) connection.Close;
    return $.parseJSON('[' + res + ']');                
};
//Получение данных списка типов (если предусмотрены) для строки табличного элемента (чеклист в модальном окне)
var getJSListData = function(id){
    var res,
            connection = new ActiveXObject("ADODB.Connection"),
            rs = new ActiveXObject("ADODB.Recordset"),
        connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
    try{
        connection.Open(connectionstring);
        rs  = connection.Execute("SELECT [dbo].[ATB_GET_JSON_ACCESS_COMPONENT_TYPES] (" + id + ")");
        rs.MoveFirst();
        res = rs.fields(0).Value;
    }
    catch(ex) {
alert(ex.message);
}
    if(rs.State == 1) rs.Close;
    if(connection.State == 1) connection.Close;
return $.parseJSON(res);                
};
var getJSDataModel = function(id){
    var res,
            connection = new ActiveXObject("ADODB.Connection"),
            rs = new ActiveXObject("ADODB.Recordset"),
        connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
    try{
        connection.Open(connectionstring);
        rs  = connection.Execute("SELECT * FROM [dbo].[ATB_AC_TEST] ('refInformationSystems;refAR_AccessComponents;refAC_Groups',1)");
        rs.MoveFirst();
        res = rs.fields(0).Value;
    }
    catch(ex) {
alert(ex.message);
}
    if(rs.State == 1) rs.Close;
    if(connection.State == 1) connection.Close;
return $.parseJSON(res);                
};
//Получене данных для табличного элемента (первичная dataModel)
var getJSData = function(expr){
    var res,
            connection = new ActiveXObject("ADODB.Connection"),
            rs = new ActiveXObject("ADODB.Recordset"),
        connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
    try{
        connection.Open(connectionstring);
        // rs  = connection.Execute("SELECT * FROM [dirdev].[dbo].[ATB_AccessComponentsDataModel] for json path");
        rs  = connection.Execute("SELECT [dbo].[ATB_GET_JSON_ACCESS_COMPONENT_SELECT] ()");
        rs.MoveFirst();
        res = rs.fields(0).Value;
    }
    catch(ex) {
alert(ex.message);
}
    if(rs.State == 1) rs.Close;
    if(connection.State == 1) connection.Close;
return $.parseJSON(res);                
};

if (!String.prototype.escapeJSON) {
  (function() {
    String.prototype.escapeJSON = function() {
        var result = "";
        for (var i = 0; i < this.length; i++)
        {
            var ch = this[i];
            switch (ch)
            {
                case "\\": ch = "\\\\"; break;
                case String.fromCharCode(34): ch = String.fromCharCode(92,34); break;
                case String.fromCharCode(39): ch = String.fromCharCode(92,39); break;
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
        return result.length ? result : this;
    }
  })();
};

if (!String.prototype.clearJSON) {
    String.prototype.clearJSON = function() {
        var result = "";
        for (var i = 0; i < this.length; i++)
        {
            var ch = this[i];
            switch (ch)
            {
                case "\\\\": ch = "\\"; break;
                case "\\\"": ch = ""; break;
                case String.fromCharCode(92,34): ch = ''; break;
                case "\\&": ch = "\&"; break;
                case "\\t": ch = "\t"; break;
                case "\\n": ch = "\n"; break;
                case "\\r": ch = "\r"; break;
                case "\\b": ch = "\b"; break;
                case "\\f": ch = "\f"; break;
                case "\\v": ch = "\v"; break;
                default: break;
            }
            result += ch;
        }
        return result.length ? result : this;
    }
};

if (!String.prototype.trim) {
  (function() {
    // Вырезаем BOM и неразрывный пробел
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  })();
};

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
};

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
};

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
};

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
};

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
};

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
};

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
};

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
};

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
};

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
};

function inArray(object, array) {
    return indexOf(object, array) >= 0
};
function indexOf(object, array, startingAt) {
    if ((object == null) || !(array instanceof Array)) {
        return -1
    }
    if (startingAt == null) {
        startingAt = 0
    }
    for (var i = startingAt; i < array.length; i++) {
        if (array[i] == object) {
            return i
        }
    }
    return -1
};
function removeFromArray(array) {
    if (!isInstance(array, Array)) {
        return null
    }
    var ret = [];
    var toRemove = Array.prototype.slice.call(removeFromArray.arguments).slice(1);
    for (var i = 0; i < array.length; i++) {
        var current = array[i];
        if (!inArray(current, toRemove)) {
            ret[ret.length] = current
        }
    }
    return ret
};
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
};

(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {return null}
        else return this.parentElement.closest(selector)
      };
}(Element.prototype));

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

function array_diff (array) {    //  Вычислить расхождение массивов
  var arr_dif = [], i = 1, argc = arguments.length, argv = arguments, key, key_c, found=false;    
  for ( key in array )// loop through 1st array        
    for (i = 1; i< argc; i++){// loop over other arrays            
      found = false;
      for (key_c in argv[i])// find in the compare array
        if (argv[i][key_c] == array[key]) {
            found = true;
            break;
        }
      if(!found)
        arr_dif[key] = array[key];
    }    
  return arr_dif;
}//Примеры:alert ( array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']) );

function ltrim ( str, charlist ) {
    charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return str.replace(re, '');
}//Примеры:alert ( '«'+ltrim('    Kevin van Zonneveld    ')+'»' );

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
// //Получение данных списка типов (если предусмотрены) для строки табличного элемента (чеклист в модальном окне)
// var getJSListData = function(id){
//     var res,
//             connection = new ActiveXObject("ADODB.Connection"),
//             rs = new ActiveXObject("ADODB.Recordset"),
//         connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
//     try{
//         connection.Open(connectionstring);
//         rs  = connection.Execute("SELECT [dbo].[ATB_GET_JSON_ACCESS_COMPONENT_TYPES] (" + id + ")");
//         rs.MoveFirst();
//         res = rs.fields(0).Value;
//     }
//     catch(ex) {
// alert(ex.message);
// }
//     if(rs.State == 1) rs.Close;
//     if(connection.State == 1) connection.Close;
// return $.parseJSON(res);                
// };
// //Получене данных для табличного элемента (первичная dataModel)
// var getJSData = function(expr){
//     var res,
//             connection = new ActiveXObject("ADODB.Connection"),
//             rs = new ActiveXObject("ADODB.Recordset"),
//         connectionstring="Provider='sqloledb';Data Source='TZ-DIR-DB';Initial Catalog='DIRDEV';Integrated Security='SSPI';";
//     try{
//         connection.Open(connectionstring);
//         rs  = connection.Execute("SELECT [dbo].[ATB_GET_JSON_ACCESS_COMPONENT_SELECT] ()");
//         rs.MoveFirst();
//         res = rs.fields(0).Value;
//     }
//     catch(ex) {
// alert(ex.message);
// }
//     if(rs.State == 1) rs.Close;
//     if(connection.State == 1) connection.Close;
// return $.parseJSON(res);                
// };

(function() {
    var traceBuffer = [];
    var tracePrettyBuffer = [];
    document.onDebug = false;
    document.DebugForm = undefined;
    document.startDebug = function() {
        openDebug();
    }
    document.trace = function(traceLog) {
        traceBuffer.push(traceLog);
    }
    document.prettyTrace = function(source) {
        res = prettyPrint( source );
        tracePrettyBuffer.push(res.innerHTML);
    }
    document.prettyPrint = function(source) {
        var output = win.document.getElementById("print"),
        res = prettyPrint( source );
        output.appendChild(res);
    }
    window.onkeypress = function(event) {
        if (event.ctrlKey && (event.key == "q"))
            openDebug();
    }
    var beforeClose = function(event) {
        if (document.onDebug) {
            document.DebugForm.close();
            var dialogText = document.onDebug;
            event.returnValue = dialogText;
        }
        return dialogText;
    }
    document.debug = function(object, separator, sort, includeObject, objectSeparator) {
        if (object == null) {
            return "null"
        }
        sort = booleanValue(sort == null ? true : sort);
        includeObject = booleanValue(includeObject == null ? true : sort);
        separator = separator || "\n";
        objectSeparator = objectSeparator || "--------------------";
        var properties = [];
        for (var property in object) {
            var part = property + " = ";
            try {
                part += object[property]
            } catch (e) {
                part += "<Error retrieving value>"
            }
            properties[properties.length] = part
        }
        if (sort) {
            properties.sort()
        }
        var out = "";
        if (includeObject) {
            try {
                out = object.toString() + separator
            } catch (e) {
                out = "<Error calling the toString() method>"
            }
            if (!isEmpty(objectSeparator)) {
                out += objectSeparator + separator
            }
        }
        out += properties.join(separator);
        return out
    }
    var isEmpty = function(object) {
    return object == null || String(object) == "" || typeof (object) == "undefined" || (typeof (object) == "number" && isNaN(object))
}
    var booleanValue = function(object, trueChars) {
        if (object == true || object == false) {
            return object
        } else {
            object = String(object);
            if (object.length == 0) {
                return false
            } else {
                var first = object.charAt(0).toUpperCase();
                trueChars = isEmpty(trueChars) ? "T1YS" : trueChars.toUpperCase();
                return trueChars.indexOf(first) != -1
            }
        }
    }
    var openDebug = function() {
        if (!document.onDebug) {
            win = window.open(bootPATH + "debug.html", "debugwin", "width=800,height=600,left=300,top=300,scrollbars=0,toolbar=0,statusbar=1,resizable=1"); //,resizable=no
            var output = win.document.getElementById("print");
            if (traceBuffer.length) {
                var traceLog = traceBuffer.join('\n'),
                    output = win.document.getElementById("print");
                output.value = output.value ? output.value + "\n" + traceLog : traceLog;
                traceBuffer = [];
            }
            if (tracePrettyBuffer.length) {
                for(var i = 0;  i < tracePrettyBuffer.length; i++){
                    //alert(tracePrettyBuffer[i].name)
                    win.document.getElementById("print").appendChild(tracePrettyBuffer[i]);
                }
                tracePrettyBuffer = [];
            }
            document.DebugForm = win;
            win.opener = window;
            win.evalHistory = [];
            win.evalIndex = 0;
            document.onDebug = true;
        } else {
            win.focus();
        }
        window.onbeforeunload = beforeClose;
    }
})(window);