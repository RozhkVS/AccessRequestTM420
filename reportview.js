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
                case String.fromCharCode(92,34): ch = ""; break;
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
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  })();
};

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
     "use strict";
    if (typeof start !== "number") {
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
};

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
};

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError(" this is null or not defined");
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
};

if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
     "use strict";
    var T, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
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
};

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
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
};

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
};

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback/*, initialValue*/) {
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
      while (k < len && ! (k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError("Reduce of empty array with no initial value");
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
    if (!isInstance(array, Array))
        return null;
    var ret = [];
    var toRemove = Array.prototype.slice.call(removeFromArray.arguments).slice(1);
    for (var i = 0; i < array.length; i++) {
        var current = array[i];
        if (!inArray(current, toRemove))
            ret[ret.length] = current
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

(function() {
    var regExp = function(name) {
        return new RegExp("(^| )"+ name +"( |$)");
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
                this.element.className =
                    this.element.className.replace(regExp(name), "");
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
}

function ltrim ( str, charlist ) {
    charlist = !charlist ? " \s\xA0" : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\$1");
    var re = new RegExp("^[" + charlist + "]+", "g");
    return str.replace(re,"");
}
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

(function(window){
  //TO DO Вынести шаблоны объявления классов внутрь объекта group-options
  var classes = ["title","stage","fields"];

  function ItemsView(data,groupsOptions){
    var activeGroupIndex = 0
        ,sourceItems="";
    var createGroupView = function(data,options){
      var target
          ,sourceItem
          ,groupOpt = options[activeGroupIndex]
          ,groupData = []
          ,groupOptions = {};
      //РЕКУРСИЯ ОСНОВАНА НА ПЕРЕДАЧЕ ВЛОЖЕННОГО ОБЪЕКТА ITEMS ПАРАМЕТРА DATA
      /*
        ТУТ ФОРМИРУЕТСЯ ОБЪЕКТ groupOpt -  НАСТРОЙКИ N-ГРУППЫ,
        ГДЕ N - УРОВЕНЬ ГРУППЫ В СТРУКТУРЕ ИЕРАРХИИ.
      */
      groupOptions.header = groupOpt.strHeader + data[groupOpt.fieldHeader];//ЗАГОЛОВОК
      groupOptions.columnPosition = groupOpt.columnPosition;//ПОЗИЦИЯ ВЫВОДА - ЯЧЕЙКА СТРОКИ ТАБЛИЦЫ
      groupOptions.columnCount = groupOpt.columnCount;//РАЗМЕР ШИРИНЫ В ЯЧЕЙКАХ
      groupOptions.level = activeGroupIndex;//УРОВЕНЬ ГРУППЫ
      /*
        groupData - МАССИВ ОБЪЕКТОВ КЛЮЧ-ЗНАЧЕНИЕ {lebal;value} КОТОРЫЕ БУДУТ
        СОСТАВЛЯТЬ ДАННЫЕ "ТАБЛИЧНОЙ" ЧАСТИ ФОРМИРУЕТСЯ НА ДАННЫХ ПАРАМЕТРА DATA
       */
      groupOpt.groupLabels.forEach(function(caption,index){
        groupData.push({label:caption,value:data[groupOpt.groupFields[index]]});
      });

      //два варианта рекурсивного вызова, реализовано для управления параметром
      //текущего уровня группы activeGroupIndex, при помощи которого определяется
      //граница рекурсивной цепочки вызовов. УНИВЕРСАЛЬНОСТЬ МЕТОДА ДЛЯ ЛЮБОГО LEVEL
      if((options.length - activeGroupIndex)>1){//<-- это общее условие, чтобы "не провалиться в никуда"
        //рекурсивный вызов
        target = new TableItem(groupData,groupOptions);
        sourceItem = target.getTextSource();
        sourceItems = sourceItems.concat(sourceItem);
        activeGroupIndex++;
        data.Items.forEach(function(newData,index){
          createGroupView(newData,options);
        });
        activeGroupIndex--;
      }
      else{
        //последний вызов в цепочке
        data.Items.forEach(function(newData){
          groupData.push({label:newData[groupOpt.fields[0]],value:newData[groupOpt.fields[1]]});
        });
        console.log(groupData);
        target = new TableItem(groupData,groupOptions);
        sourceItem = target.getTextSource();
        sourceItems = sourceItems.concat(sourceItem);
      }
    };
    createGroupView(data,groupsOptions);
    this.items = sourceItems;
  }
  ItemsView.prototype.getSource = function(){
    return this.items;
  };

  function TableItem(items, options) {
    this.items = items;
    this.options = options;
    if(options.level)
      this.level = options.level;
    else this.level = 0;
    this.colspan = options.columnCount - options.columnPosition - this.level;
    this.sourceFragment = _createItem(this);
  }
  // TableItem.prototype.getSource = function(){
  //   return $(this.sourceFragment);
  // };
  TableItem.prototype.getTextSource = function(){
    return this.sourceFragment;
  };
  function _createItemHeader(obj){
    var header = obj.options.header,
        htmlText = new String();
    if(obj.level == 0)
      htmlText = "<tr><th colspan=\"" + obj.options.columnCount + "\" class=\"title\">" + _headTemplete(header,obj.level) + "</th></tr>"
    else
      htmlText = "<tr><td colspan=\"" + obj.options.columnCount + "\" class=\""+classes[obj.level]+"\">" + _headTemplete(header,obj.level) + "</td></tr>";
    return htmlText;
  }
  function _createItem(obj){
    var header = _createItemHeader(obj),
        body = _createBodyItem(obj);
    if(obj.level == 0)
      return "<thead>" + header + "</thead><tbody>" + body + "</tbody>"
    else
      return "<tbody>" + header + body + "</tbody>";
  }
  function _createBodyItem(obj){
    var htmlText = new String();
    obj.items.forEach(function(el){
      var htmlRow = _createRow(el,obj);
      if(htmlRow.length)
        htmlText = htmlText + "<tr>" + htmlRow + "</tr>"
    })
    return htmlText;
  }
  function _createRow(item,obj){
    var label = item.label,
        value = item.value,
        htmlText = new String();
    for(var i = 0; i < obj.options.columnCount; i++){
      if(i == obj.options.columnPosition){
        if(obj.level<=1)
          if(obj.options.columnPosition<1)
            htmlText = htmlText + "<td>" + _cellTemplete(label,obj.level,200) + "</td>"//вывести в ячейку label
          else
            htmlText = htmlText + "<td>" + _cellTemplete(label,obj.level - obj.options.columnPosition,200) + "</td>";
        else
          htmlText = htmlText + "<td>" + _cellTemplete(label,obj.level - 2,200) + "</td>";
      }
      else{
        if(i < obj.options.columnPosition)
          htmlText = htmlText + "<td>" + _cellTemplete("&nbsp;",obj.level) + "</td>"//пустая ячейка
        else
          if(obj.colspan == 1)
            htmlText = htmlText + "<td>" + _cellTemplete(value,0,100 * obj.colspan) + "</td>"//вывести в ячейку value
          else
          {//соеденить оставшиеся я чейки в одну и вывести value
            htmlText = htmlText + "<td colspan=\"" + obj.colspan + "\">" + _cellTemplete(value,0,100 * obj.colspan) + "</td>";
            break;
          }
      }
    }
    return  htmlText.length ? htmlText : "";
  }
  function _cellTemplete(val,level,width){
    var aTag = (width==300) ? "word-break:break-all;" : ""
        ,value = (val !== undefined) ? val : ""
        ,leftMargin = 10 * (level + 2)
        ,css = "style=\"text-align: left;word-wrap: break-word; " + aTag + "padding: 1px 0px 5px "+ leftMargin +"px;\"";
        console.log(css);
    return "<div " + css + ">" + value + "</div>";
  }
  function _headTemplete(val,level){
    var  leftMargin = 10 * (level + 1)
        ,css = "style=\"text-align: left; padding:5px 0px 5px " + leftMargin + "px; width:100%\""
    return "<div " + css + ">" + val + "</div>";
  }
  window.TableItem = TableItem;
  window.ItemsView = ItemsView;

})(window);