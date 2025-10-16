/*
 * JavaScriptUtil is a part of JavaScripTools (http://javascriptools.sourceforge.net).
 * This file was compressed using JavaScriptZip (http://javascriptzip.sourceforge.net).
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Version: 2.2.5
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
*/
var JST_CHARS_NUMBERS = "0123456789";
var JST_CHARS_LOWER = "";
var JST_CHARS_UPPER = "";
for (var i = 50; i < 500; i++) {
    var c = String.fromCharCode(i);
    var lower = c.toLowerCase();
    var upper = c.toUpperCase();
    if (lower != upper) {
        JST_CHARS_LOWER += lower;
        JST_CHARS_UPPER += upper
    }
}
var JST_CHARS_LETTERS = JST_CHARS_LOWER + JST_CHARS_UPPER;
var JST_CHARS_ALPHA = JST_CHARS_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_BASIC_LOWER = "abcdefghijklmnopqrstuvwxyz";
var JST_CHARS_BASIC_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var JST_CHARS_BASIC_LETTERS = JST_CHARS_BASIC_LOWER + JST_CHARS_BASIC_UPPER;
var JST_CHARS_BASIC_ALPHA = JST_CHARS_BASIC_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_WHITESPACE = " \t\n\r";
var MILLIS_IN_SECOND = 1000;
var MILLIS_IN_MINUTE = 60 * MILLIS_IN_SECOND;
var MILLIS_IN_HOUR = 60 * MILLIS_IN_MINUTE;
var MILLIS_IN_DAY = 24 * MILLIS_IN_HOUR;
var JST_FIELD_MILLISECOND = 0;
var JST_FIELD_SECOND = 1;
var JST_FIELD_MINUTE = 2;
var JST_FIELD_HOUR = 3;
var JST_FIELD_DAY = 4;
var JST_FIELD_MONTH = 5;
var JST_FIELD_YEAR = 6;
function getObject(objectName, source) {
    if (isEmpty(objectName)) {
        return null
    }
    if (!isInstance(objectName, String)) {
        return objectName
    }
    if (isEmpty(source)) {
        source = self
    }
    if (isInstance(source, String)) {
        sourceName = source;
        source = self.frames[sourceName];
        if (source == null)
            source = parent.frames[sourceName];
        if (source == null)
            source = top.frames[sourceName];
        if (source == null)
            source = getObject(sourceName);
        if (source == null)
            return null
    }
    var document = (source.document) ? source.document : source;
    if (document.getElementById) {
        var collection = document.getElementsByName(objectName);
        if (collection.length == 1)
            return collection[0];
        if (collection.length > 1) {
            if (typeof (collection) == "array") {
                return collection
            }
            var ret = new Array(collection.length);
            for (var i = 0; i < collection.length; i++) {
                ret[i] = collection[i]
            }
            return ret
        }
        return document.getElementById(objectName)
    } else {
        if (document[objectName])
            return document[objectName];
        if (document.all[objectName])
            return document.all[objectName];
        if (source[objectName])
            return source[objectName]
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
function booleanValue(object, trueChars) {
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
function isUndefined(object) {
    return typeof (object) == "undefined"
}
function invoke(functionName, args) {
    var arguments;
    if (args == null || isUndefined(args)) {
        arguments = "()"
    } else if (!isInstance(args, Array)) {
        arguments = "(args)"
    } else {
        arguments = "(";
        for (var i = 0; i < args.length; i++) {
            if (i > 0) {
                arguments += ","
            }
            arguments += "args[" + i + "]"
        }
        arguments += ")"
    }
    return eval(functionName + arguments)
}
function invokeAsMethod(object, method, args) {
    return method.apply(object, args)
}
function ensureArray(object) {
    if (typeof (object) == 'undefined' || object == null) {
        return []
    }
    if (object instanceof Array) {
        return object
    }
    return [object]
}
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
}
function inArray(object, array) {
    return indexOf(object, array) >= 0
}
function removeFromArray(array) {
    if (!isInstance(array, Array)) {
        return null
    }
    var ret = [];
    var toRemove = removeFromArray.arguments.slice(1);
    for (var i = 0; i < array.length; i++) {
        var current = array[i];
        if (!inArray(current, toRemove)) {
            ret[ret.length] = current
        }
    }
    return ret
}
function arrayConcat() {
    var ret = [];
    for (var i = 0; i < arrayConcat.arguments.length; i++) {
        var current = arrayConcat.arguments[i];
        if (!isEmpty(current)) {
            if (!isInstance(current, Array)) {
                current = [current]
            }
            for (j = 0; j < current.length; j++) {
                ret[ret.length] = current[j]
            }
        }
    }
    return ret
}
function arrayEquals(array1, array2) {
    if (!isInstance(array1, Array) || !isInstance(array2, Array)) {
        return false
    }
    if (array1.length != array2.length) {
        return false
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false
        }
    }
    return true
}
function checkAll(object, flag) {
    if (typeof (object) == "string") {
        object = getObject(object)
    }
    if (object != null) {
        if (!isInstance(object, Array)) {
            object = [object]
        }
        for (i = 0; i < object.length; i++) {
            object[i].checked = flag
        }
    }
}
function observeEvent(object, eventName, handler) {
    object = getObject(object);
    if (object != null) {
        if (object.addEventListener) {
            object.addEventListener(eventName, function(e) {
                return invokeAsMethod(object, handler, [e])
            }, false)
        } else if (object.attachEvent) {
            object.attachEvent("on" + eventName, function() {
                return invokeAsMethod(object, handler, [window.event])
            })
        } else {
            object["on" + eventName] = handler
        }
    }
}
function typedCode(event) {
    var code = 0;
    if (event == null && window.event) {
        event = window.event
    }
    if (event != null) {
        if (event.keyCode) {
            code = event.keyCode
        } else if (event.which) {
            code = event.which
        }
    }
    return code
}
function stopPropagation(event) {
    if (event == null && window.event) {
        event = window.event
    }
    if (event != null) {
        if (event.stopPropagation != null) {
            event.stopPropagation()
        } else if (event.cancelBubble !== null) {
            event.cancelBubble = true
        }
    }
    return false
}
function preventDefault(event) {
    if (event == null && window.event) {
        event = window.event
    }
    if (event != null) {
        if (event.preventDefault != null) {
            event.preventDefault()
        } else if (event.returnValue !== null) {
            event.returnValue = false
        }
    }
    return false
}
function prepareForCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null
    }
    if (object.createTextRange) {
        var handler = function() {
            object.caret = document.selection.createRange().duplicate()
        }
        observeEvent(object, "onclick", handler);
        observeEvent(object, "ondblclick", handler);
        observeEvent(object, "onselect", handler);
        observeEvent(object, "onkeyup", handler)
    }
}
function isCaretSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false
    }
    if (navigator.userAgent.toLowerCase().indexOf("opera") >= 0) {
        return false
    }
    return object.setSelectionRange != null || object.createTextRange != null
}
function isInputSelectionSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false
    }
    return object.setSelectionRange != null || object.createTextRange != null
}
function getInputSelection(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null
    }
    try {
        if (object.createTextRange && object.caret) {
            return object.caret.text
        } else if (object.setSelectionRange) {
            var selStart = object.selectionStart;
            var selEnd = object.selectionEnd;
            return object.value.substring(selStart, selEnd)
        }
    } catch (e) {}
    return ""
}
function getInputSelectionRange(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null
    }
    try {
        if (object.selectionEnd) {
            return [object.selectionStart, object.selectionEnd]
        } else if (object.createTextRange && object.caret) {
            var end = getCaret(object);
            return [end - object.caret.text.length, end]
        }
    } catch (e) {}
    return null
}
function setInputSelectionRange(object, start, end) {
    object = getObject(object);
    if (object == null || !object.type) {
        return
    }
    try {
        if (start < 0) {
            start = 0
        }
        if (end > object.value.length) {
            end = object.value.length
        }
        if (object.setSelectionRange) {
            object.focus();
            object.setSelectionRange(start, end)
        } else if (object.createTextRange) {
            object.focus();
            var range;
            if (object.caret) {
                range = object.caret;
                range.moveStart("textedit", -1);
                range.moveEnd("textedit", -1)
            } else {
                range = object.createTextRange()
            }
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select()
        }
    } catch (e) {}
}
function getCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null
    }
    try {
        if (object.createTextRange && object.caret) {
            var range = object.caret.duplicate();
            range.moveStart('textedit', -1);
            return range.text.length
        } else if (object.selectionStart || object.selectionStart == 0) {
            return object.selectionStart
        }
    } catch (e) {}
    return null
}
function setCaret(object, pos) {
    setInputSelectionRange(object, pos, pos)
}
function setCaretToEnd(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return
    }
    try {
        if (object.createTextRange) {
            var range = object.createTextRange();
            range.collapse(false);
            range.select()
        } else if (object.setSelectionRange) {
            var length = object.value.length;
            object.setSelectionRange(length, length);
            object.focus()
        }
    } catch (e) {}
}
function setCaretToStart(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return
    }
    try {
        if (object.createTextRange) {
            var range = object.createTextRange();
            range.collapse(true);
            range.select()
        } else if (object.setSelectionRange) {
            object.focus();
            object.setSelectionRange(0, 0)
        }
    } catch (e) {}
}
function selectString(object, string) {
    if (isInstance(object, String)) {
        object = getObject(object)
    }
    if (object == null || !object.type) {
        return
    }
    var match = new RegExp(string,"i").exec(object.value);
    if (match) {
        setInputSelectionRange(object, match.index, match.index + match[0].length)
    }
}
function replaceSelection(object, string) {
    object = getObject(object);
    if (object == null || !object.type) {
        return
    }
    if (object.setSelectionRange) {
        var selectionStart = object.selectionStart;
        var selectionEnd = object.selectionEnd;
        object.value = object.value.substring(0, selectionStart) + string + object.value.substring(selectionEnd);
        if (selectionStart != selectionEnd) {
            setInputSelectionRange(object, selectionStart, selectionStart + string.length)
        } else {
            setCaret(object, selectionStart + string.length)
        }
    } else if (object.createTextRange && object.caret) {
        object.caret.text = string
    }
}
function clearOptions(select) {
    select = getObject(select);
    var ret = [];
    if (select != null) {
        for (var i = 0; i < select.options.length; i++) {
            var option = select.options[i];
            ret[ret.length] = new Option(option.text,option.value)
        }
        select.options.length = 0
    }
    return ret
}
function addOption(select, option, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null || option == null) {
        return
    }
    textProperty = textProperty || "text";
    valueProperty = valueProperty || "value";
    selectedProperty = selectedProperty || "selected"
    if (isInstance(option, Map)) {
        option = option.toObject()
    }
    if (isUndefined(option[valueProperty])) {
        valueProperty = textProperty
    }
    var selected = false;
    if (!isUndefined(option[selectedProperty])) {
        selected = option[selectedProperty]
    }
    option = new Option(option[textProperty],option[valueProperty],selected,selected);
    select.options[select.options.length] = option;
    if (booleanValue(sort)) {
        sortOptions(select)
    }
}
function addOptions(select, options, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null) {
        return
    }
    for (var i = 0; i < options.length; i++) {
        addOption(select, options[i], false, textProperty, valueProperty, selectedProperty)
    }
    if (!select.multiple && select.selectedIndex < 0 && select.options.length > 0) {
        select.selectedIndex = 0
    }
    if (booleanValue(sort)) {
        sortOptions(select)
    }
}
function compareOptions(opt1, opt2) {
    if (opt1 == null && opt2 == null) {
        return 0
    }
    if (opt1 == null) {
        return -1
    }
    if (opt2 == null) {
        return 1
    }
    if (opt1.text == opt2.text) {
        return 0
    } else if (opt1.text > opt2.text) {
        return 1
    } else {
        return -1
    }
}
function setOptions(select, options, addEmpty, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    var ret = clearOptions(select);
    var addEmptyIsString = isInstance(addEmpty, String);
    if (addEmptyIsString || booleanValue(addEmpty)) {
        select.options[0] = new Option(addEmptyIsString ? addEmpty : "")
    }
    addOptions(select, options, sort, textProperty, valueProperty, selectedProperty);
    return ret
}
function sortOptions(select, sortFunction) {
    select = getObject(select);
    if (select == null) {
        return
    }
    var options = clearOptions(select);
    if (isInstance(sortFunction, Function)) {
        options.sort(sortFunction)
    } else {
        options.sort(compareOptions)
    }
    setOptions(select, options)
}
function transferOptions(source, dest, all, sort) {
    source = getObject(source);
    dest = getObject(dest);
    if (source == null || dest == null) {
        return
    }
    if (booleanValue(all)) {
        addOptions(dest, clearOptions(source), sort)
    } else {
        var sourceOptions = [];
        var destOptions = [];
        for (var i = 0; i < source.options.length; i++) {
            var option = source.options[i];
            var options = (option.selected) ? destOptions : sourceOptions;
            options[options.length] = new Option(option.text,option.value)
        }
        setOptions(source, sourceOptions, false, sort);
        addOptions(dest, destOptions, sort)
    }
}
function getValue(object) {
    object = getObject(object);
    if (object == null) {
        return null
    }
    if (object.length && !object.type) {
        var ret = [];
        for (var i = 0; i < object.length; i++) {
            var temp = getValue(object[i]);
            if (temp != null) {
                ret[ret.length] = temp
            }
        }
        return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret
    }
    if (object.type) {
        if (object.type.indexOf("select") >= 0) {
            var ret = [];
            if (!object.multiple && object.selectedIndex < 0 && object.options.length > 0) {
                ret[ret.length] = object.options[0].value
            } else {
                for (i = 0; i < object.options.length; i++) {
                    var option = object.options[i];
                    if (option.selected) {
                        ret[ret.length] = option.value;
                        if (!object.multiple) {
                            break
                        }
                    }
                }
            }
            return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret
        }
        if (object.type == "radio" || object.type == "checkbox") {
            return booleanValue(object.checked) ? object.value : null
        } else {
            return object.value
        }
    } else if (typeof (object.innerHTML) != "undefined") {
        return object.innerHTML
    } else {
        return null
    }
}
function setValue(object, value) {
    if (object == null) {
        return
    }
    if (typeof (object) == "string") {
        object = getObject(object)
    }
    var values = ensureArray(value);
    for (var i = 0; i < values.length; i++) {
        values[i] = values[i] == null ? "" : "" + values[i]
    }
    if (object.length && !object.type) {
        while (values.length < object.length) {
            values[values.length] = ""
        }
        for (var i = 0; i < object.length; i++) {
            var obj = object[i];
            setValue(obj, inArray(obj.type, ["checkbox", "radio"]) ? values : values[i])
        }
        return
    }
    if (object.type) {
        if (object.type.indexOf("select") >= 0) {
            for (var i = 0; i < object.options.length; i++) {
                var option = object.options[i];
                option.selected = inArray(option.value, values)
            }
            return
        } else if (object.type == "radio" || object.type == "checkbox") {
            object.checked = inArray(object.value, values);
            return
        } else {
            object.value = values.length == 0 ? "" : values[0];
            return
        }
    } else if (typeof (object.innerHTML) != "undefined") {
        object.innerHTML = values.length == 0 ? "" : values[0]
    }
}
function decode(object) {
    var args = decode.arguments;
    for (var i = 1; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (args[i] == object) {
                return args[i + 1]
            }
        } else {
            return args[i]
        }
    }
    return null
}
function select() {
    var args = select.arguments;
    for (var i = 0; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (booleanValue(args[i])) {
                return args[i + 1]
            }
        } else {
            return args[i]
        }
    }
    return null
}
function isEmpty(object) {
    return object == null || String(object) == "" || typeof (object) == "undefined" || (typeof (object) == "number" && isNaN(object))
}
function ifEmpty(object, emptyValue) {
    return isEmpty(object) ? emptyValue : object
}
function ifNull(object, nullValue) {
    return object == null ? nullValue : object
}
function replaceAll(string, find, replace) {
    return String(string).split(find).join(replace)
}
function repeat(string, times) {
    var ret = "";
    for (var i = 0; i < Number(times); i++) {
        ret += string
    }
    return ret
}
function ltrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = 0;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos <= string.length)) {
        pos++
    }
    return string.substr(pos)
}
function rtrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = string.length - 1;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos >= 0)) {
        pos--
    }
    return string.substring(0, pos + 1)
}
function trim(string, chars) {
    chars = chars || JST_CHARS_WHITESPACE;
    return ltrim(rtrim(string, chars), chars)
}
function lpad(string, size, chr) {
    string = String(string);
    if (size < 0) {
        return ""
    }
    if (isEmpty(chr)) {
        chr = " "
    } else {
        chr = String(chr).charAt(0)
    }
    while (string.length < size) {
        string = chr + string
    }
    return left(string, size)
}
function rpad(string, size, chr) {
    string = String(string);
    if (size <= 0) {
        return ""
    }
    chr = String(chr);
    if (isEmpty(chr)) {
        chr = " "
    } else {
        chr = chr.charAt(0)
    }
    while (string.length < size) {
        string += chr
    }
    return left(string, size)
}
function crop(string, pos, size) {
    string = String(string);
    if (size == null) {
        size = 1
    }
    if (size <= 0) {
        return ""
    }
    return left(string, pos) + mid(string, pos + size)
}
function lcrop(string, size) {
    if (size == null) {
        size = 1
    }
    return crop(string, 0, size)
}
function rcrop(string, size) {
    string = String(string);
    if (size == null) {
        size = 1
    }
    return crop(string, string.length - size, size)
}
function capitalize(text, separators) {
    text = String(text);
    separators = separators || JST_CHARS_WHITESPACE + '.?!';
    var out = "";
    var last = '';
    for (var i = 0; i < text.length; i++) {
        var current = text.charAt(i);
        if (separators.indexOf(last) >= 0) {
            out += current.toUpperCase()
        } else {
            out += current.toLowerCase()
        }
        last = current
    }
    return out
}
function onlySpecified(string, possible) {
    string = String(string);
    possible = String(possible);
    for (var i = 0; i < string.length; i++) {
        if (possible.indexOf(string.charAt(i)) == -1) {
            return false
        }
    }
    return true
}
function onlyNumbers(string) {
    return onlySpecified(string, JST_CHARS_NUMBERS)
}
function onlyLetters(string) {
    return onlySpecified(string, JST_CHARS_LETTERS)
}
function onlyAlpha(string) {
    return onlySpecified(string, JST_CHARS_ALPHA)
}
function onlyBasicLetters(string) {
    return onlySpecified(string, JST_CHARS_BASIC_LETTERS)
}
function onlyBasicAlpha(string) {
    return onlySpecified(string, JST_CHARS_BASIC_ALPHA)
}
function left(string, n) {
    string = String(string);
    return string.substring(0, n)
}
function right(string, n) {
    string = String(string);
    return string.substr(string.length - n)
}
function mid(string, pos, n) {
    string = String(string);
    if (n == null) {
        n = string.length
    }
    return string.substring(pos, pos + n)
}
function insertString(string, pos, value) {
    string = String(string);
    var prefix = left(string, pos);
    var suffix = mid(string, pos)
    return prefix + value + suffix
}
function functionName(funct, unnamed) {
    if (typeof (funct) == "function") {
        var src = funct.toString();
        var start = src.indexOf("function");
        var end = src.indexOf("(");
        if ((start >= 0) && (end >= 0)) {
            start += 8;
            var name = trim(src.substring(start, end));
            return isEmpty(name) ? (unnamed || "[unnamed]") : name
        }
    }
    if (typeof (funct) == "object") {
        return functionName(funct.constructor)
    }
    return null
}
function debug(object, separator, sort, includeObject, objectSeparator) {
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
function escapeCharacters(string, extraChars, onlyExtra) {
    var ret = String(string);
    extraChars = String(extraChars || "");
    onlyExtra = booleanValue(onlyExtra);
    if (!onlyExtra) {
        ret = replaceAll(ret, "\n", "\\n");
        ret = replaceAll(ret, "\r", "\\r");
        ret = replaceAll(ret, "\t", "\\t");
        ret = replaceAll(ret, "\"", "\\\"");
        ret = replaceAll(ret, "\'", "\\\'");
        ret = replaceAll(ret, "\\", "\\\\")
    }
    for (var i = 0; i < extraChars.length; i++) {
        var chr = extraChars.charAt(i);
        ret = replaceAll(ret, chr, "\\\\u" + lpad(new Number(chr.charCodeAt(0)).toString(16), 4, '0'))
    }
    return ret
}
function unescapeCharacters(string, onlyExtra) {
    var ret = String(string);
    var pos = -1;
    var u = "\\\\u";
    onlyExtra = booleanValue(onlyExtra);
    do {
        pos = ret.indexOf(u);
        if (pos >= 0) {
            var charCode = parseInt(ret.substring(pos + u.length, pos + u.length + 4), 16);
            ret = replaceAll(ret, u + charCode, String.fromCharCode(charCode))
        }
    } while (pos >= 0);if (!onlyExtra) {
        ret = replaceAll(ret, "\\n", "\n");
        ret = replaceAll(ret, "\\r", "\r");
        ret = replaceAll(ret, "\\t", "\t");
        ret = replaceAll(ret, "\\\"", "\"");
        ret = replaceAll(ret, "\\\'", "\'");
        ret = replaceAll(ret, "\\\\", "\\")
    }
    return ret
}
function writeCookie(name, value, document, expires, path, domain, secure) {
    document = document || self.document;
    var str = name + "=" + (isEmpty(value) ? "" : encodeURIComponent(value));
    if (path != null)
        str += "; path=" + path;
    if (domain != null)
        str += "; domain=" + domain;
    if (secure != null && booleanValue(secure))
        str += "; secure";
    if (expires === false)
        expires = new Date(2500,12,31);
    if (expires instanceof Date)
        str += "; expires=" + expires.toGMTString();
    document.cookie = str
}
function readCookie(name, document) {
    document = document || self.document;
    var prefix = name + "=";
    var cookie = document.cookie;
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
        begin = cookie.indexOf(prefix);
        if (begin != 0)
            return null
    } else
        begin += 2;
    var end = cookie.indexOf(";", begin);
    if (end == -1)
        end = cookie.length;
    return decodeURIComponent(cookie.substring(begin + prefix.length, end))
}
function deleteCookie(name, document, path, domain) {
    writeCookie(name, null, document, path, domain)
}
function getDateField(date, field) {
    if (!isInstance(date, Date)) {
        return null
    }
    switch (field) {
    case JST_FIELD_MILLISECOND:
        return date.getMilliseconds();
    case JST_FIELD_SECOND:
        return date.getSeconds();
    case JST_FIELD_MINUTE:
        return date.getMinutes();
    case JST_FIELD_HOUR:
        return date.getHours();
    case JST_FIELD_DAY:
        return date.getDate();
    case JST_FIELD_MONTH:
        return date.getMonth();
    case JST_FIELD_YEAR:
        return date.getFullYear()
    }
    return null
}
function setDateField(date, field, value) {
    if (!isInstance(date, Date)) {
        return
    }
    switch (field) {
    case JST_FIELD_MILLISECOND:
        date.setMilliseconds(value);
        break;
    case JST_FIELD_SECOND:
        date.setSeconds(value);
        break;
    case JST_FIELD_MINUTE:
        date.setMinutes(value);
        break;
    case JST_FIELD_HOUR:
        date.setHours(value);
        break;
    case JST_FIELD_DAY:
        date.setDate(value);
        break;
    case JST_FIELD_MONTH:
        date.setMonth(value);
        break;
    case JST_FIELD_YEAR:
        date.setFullYear(value);
        break
    }
}
function dateAdd(date, amount, field) {
    if (!isInstance(date, Date)) {
        return null
    }
    if (amount == 0) {
        return new Date(date.getTime())
    }
    if (!isInstance(amount, Number)) {
        amount = 1
    }
    if (field == null)
        field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null
    }
    var time = date.getTime();
    if (field <= JST_FIELD_DAY) {
        var mult = 1;
        switch (field) {
        case JST_FIELD_SECOND:
            mult = MILLIS_IN_SECOND;
            break;
        case JST_FIELD_MINUTE:
            mult = MILLIS_IN_MINUTE;
            break;
        case JST_FIELD_HOUR:
            mult = MILLIS_IN_HOUR;
            break;
        case JST_FIELD_DAY:
            mult = MILLIS_IN_DAY;
            break
        }
        var time = date.getTime();
        time += mult * amount;
        return new Date(time)
    }
    var ret = new Date(time);
    var day = ret.getDate();
    var month = ret.getMonth();
    var year = ret.getFullYear();
    if (field == JST_FIELD_YEAR) {
        year += amount
    } else if (field == JST_FIELD_MONTH) {
        month += amount
    }
    while (month > 11) {
        month -= 12;
        year++
    }
    day = Math.min(day, getMaxDay(month, year));
    ret.setDate(day);
    ret.setMonth(month);
    ret.setFullYear(year);
    return ret
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
function truncDate(date, field) {
    if (!isInstance(date, Date)) {
        return null
    }
    if (field == null)
        field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null
    }
    var ret = new Date(date.getTime());
    if (field > JST_FIELD_MILLISECOND) {
        ret.setMilliseconds(0)
    }
    if (field > JST_FIELD_SECOND) {
        ret.setSeconds(0)
    }
    if (field > JST_FIELD_MINUTE) {
        ret.setMinutes(0)
    }
    if (field > JST_FIELD_HOUR) {
        ret.setHours(0)
    }
    if (field > JST_FIELD_DAY) {
        ret.setDate(1)
    }
    if (field > JST_FIELD_MONTH) {
        ret.setMonth(0)
    }
    return ret
}
function getMaxDay(month, year) {
    month = new Number(month) + 1;
    year = new Number(year);
    switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        return 31;
    case 4:
    case 6:
    case 9:
    case 11:
        return 30;
    case 2:
        if ((year % 4) == 0) {
            return 29
        } else {
            return 28
        }
    default:
        return 0
    }
}
function getFullYear(year) {
    year = Number(year);
    if (year < 1000) {
        if (year < 50 || year > 100) {
            year += 2000
        } else {
            year += 1900
        }
    }
    return year
}
function setOpacity(object, value) {
    object = getObject(object);
    if (object == null) {
        return
    }
    value = Math.round(Number(value));
    if (isNaN(value) || value > 100) {
        value = 100
    }
    if (value < 0) {
        value = 0
    }
    var style = object.style;
    if (style == null) {
        return
    }
    style.MozOpacity = value / 100;
    style.filter = "alpha(opacity=" + value + ")"
}
function getOpacity(object) {
    object = getObject(object);
    if (object == null) {
        return
    }
    var style = object.style;
    if (style == null) {
        return
    }
    if (style.MozOpacity) {
        return Math.round(style.MozOpacity * 100)
    } else if (style.filter) {
        var regExp = new RegExp("alpha\\(opacity=(\d*)\\)");
        var array = regExp.exec(style.filter);
        if (array != null && array.length > 1) {
            return parseInt(array[1], 10)
        }
    }
    return 100
}
function Pair(key, value) {
    this.key = key == null ? "" : key;
    this.value = value;
    this.toString = function() {
        return this.key + "=" + this.value
    }
}
function Value(key, value) {
    this.base = Pair;
    this.base(key, value)
}
function Map(pairs) {
    this.pairs = pairs || [];
    this.afterSet = null;
    this.afterRemove = null;
    this.putValue = function(pair) {
        this.putPair(pair)
    }
    this.putPair = function(pair) {
        if (isInstance(pair, Pair)) {
            for (var i = 0; i < this.pairs.length; i++) {
                if (this.pairs[i].key == pair.key) {
                    this.pairs[i].value = pair.value
                }
            }
            this.pairs[this.pairs.length] = pair;
            if (this.afterSet != null) {
                this.afterSet(pair, this)
            }
        }
    }
    this.put = function(key, value) {
        this.putValue(new Pair(key,value))
    }
    this.putAll = function(map) {
        if (!(map instanceof Map)) {
            return
        }
        var entries = map.getEntries();
        for (var i = 0; i < entries.length; i++) {
            this.putPair(entries[i])
        }
    }
    this.size = function() {
        return this.pairs.length
    }
    this.get = function(key) {
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            if (pair.key == key) {
                return pair.value
            }
        }
        return null
    }
    this.getKeys = function() {
        var ret = [];
        for (var i = 0; i < this.pairs.length; i++) {
            ret[ret.length] = this.pairs[i].key
        }
        return ret
    }
    this.getValues = function() {
        var ret = [];
        for (var i = 0; i < this.pairs.length; i++) {
            ret[ret.length] = this.pairs[i].value
        }
        return ret
    }
    this.getEntries = function() {
        return this.getPairs()
    }
    this.getPairs = function() {
        var ret = [];
        for (var i = 0; i < this.pairs.length; i++) {
            ret[ret.length] = this.pairs[i]
        }
        return ret
    }
    this.remove = function(key) {
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            if (pair.key == key) {
                this.pairs.splice(i, 1);
                if (this.afterRemove != null) {
                    this.afterRemove(pair, this)
                }
                return pair
            }
        }
        return null
    }
    this.clear = function(key) {
        var ret = this.pairs;
        for (var i = 0; i < ret.length; i++) {
            this.remove(ret[i].key)
        }
        return ret
    }
    this.toString = function() {
        return functionName(this.constructor) + ": {" + this.pairs + "}"
    }
    this.toObject = function() {
        ret = {};
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            ret[pair.key] = pair.value
        }
        return ret
    }
}
function StringMap(string, nameSeparator, valueSeparator, isEncoded) {
    this.nameSeparator = nameSeparator || "&";
    this.valueSeparator = valueSeparator || "=";
    this.isEncoded = isEncoded == null ? true : booleanValue(isEncoded);
    var pairs = [];
    string = trim(string);
    if (!isEmpty(string)) {
        var namesValues = string.split(nameSeparator);
        for (i = 0; i < namesValues.length; i++) {
            var nameValue = namesValues[i].split(valueSeparator);
            var name = trim(nameValue[0]);
            var value = "";
            if (nameValue.length > 0) {
                value = trim(nameValue[1]);
                if (this.isEncoded) {
                    value = decodeURIComponent(value)
                }
            }
            var pos = -1;
            for (j = 0; j < pairs.length; j++) {
                if (pairs[j].key == name) {
                    pos = j;
                    break
                }
            }
            if (pos >= 0) {
                var array = pairs[pos].value;
                if (!isInstance(array, Array)) {
                    array = [array]
                }
                array[array.length] = value;
                pairs[pos].value = array
            } else {
                pairs[pairs.length] = new Pair(name,value)
            }
        }
    }
    this.base = Map;
    this.base(pairs);
    this.getString = function() {
        var ret = [];
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            ret[ret.length] = pair.key + this.valueSeparator + this.value
        }
        return ret.join(this.nameSeparator)
    }
}
function QueryStringMap(location) {
    this.location = location || self.location;
    var string = String(this.location.search);
    if (!isEmpty(string)) {
        string = string.substr(1)
    }
    this.base = StringMap;
    this.base(string, "&", "=", true);
    this.putPair = function() {
        alert("Cannot put a value on a query string")
    }
    this.remove = function() {
        alert("Cannot remove a value from a query string")
    }
}
function CookieMap(document) {
    this.document = document || self.document;
    this.base = StringMap;
    this.base(document.cookie, ";", "=", true);
    this.afterSet = function(pair) {
        writeCookie(pair.key, pair.value, this.document)
    }
    this.afterRemove = function(pair) {
        deleteCookie(pair.key, this.document)
    }
}
function ObjectMap(object) {
    this.object = object;
    var pairs = [];
    for (var property in this.object) {
        pairs[pairs.length] = new Pair(property,this.object[property])
    }
    this.base = Map;
    this.base(pairs);
    this.afterSet = function(pair) {
        this.object[pair.key] = pair.value
    }
    this.afterRemove = function(pair) {
        try {
            delete object[pair.key]
        } catch (exception) {
            object[pair.key] = null
        }
    }
}
function StringBuffer(initialCapacity) {
    this.initialCapacity = initialCapacity || 10;
    this.buffer = new Array(this.initialCapacity);
    this.append = function(value) {
        this.buffer[this.buffer.length] = value;
        return this
    }
    this.clear = function() {
        delete this.buffer;
        this.buffer = new Array(this.initialCapacity)
    }
    this.toString = function() {
        return this.buffer.join("")
    }
    this.length = function() {
        return this.toString().length
    }
}


/*
 * Parsers is a part of JavaScripTools (http://javascriptools.sourceforge.net).
 * This file was compressed using JavaScriptZip (http://javascriptzip.sourceforge.net).
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Version: 2.2.5
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
*/
var JST_DEFAULT_DECIMAL_DIGITS = -1;
var JST_DEFAULT_DECIMAL_SEPARATOR = ",";
var JST_DEFAULT_GROUP_SEPARATOR = ".";
var JST_DEFAULT_USE_GROUPING = false;
var JST_DEFAULT_CURRENCY_SYMBOL = "R$";
var JST_DEFAULT_USE_CURRENCY = false;
var JST_DEFAULT_NEGATIVE_PARENTHESIS = false;
var JST_DEFAULT_GROUP_SIZE = 3;
var JST_DEFAULT_SPACE_AFTER_CURRENCY = true;
var JST_DEFAULT_CURRENCY_INSIDE = false;
var JST_DEFAULT_DATE_MASK = "dd/MM/yyyy";
var JST_DEFAULT_ENFORCE_LENGTH = true;
var JST_DEFAULT_TRUE_VALUE = "true";
var JST_DEFAULT_FALSE_VALUE = "false";
var JST_DEFAULT_USE_BOOLEAN_VALUE = true;
function Parser() {
    this.parse = function(text) {
        return text
    }
    this.format = function(value) {
        return value
    }
    this.isValid = function(text) {
        return isEmpty(text) || (this.parse(text) != null)
    }
}
function NumberParser(decimalDigits, decimalSeparator, groupSeparator, useGrouping, currencySymbol, useCurrency, negativeParenthesis, groupSize, spaceAfterCurrency, currencyInside) {
    this.base = Parser;
    this.base();
    this.decimalDigits = (decimalDigits == null) ? JST_DEFAULT_DECIMAL_DIGITS : decimalDigits;
    this.decimalSeparator = (decimalSeparator == null) ? JST_DEFAULT_DECIMAL_SEPARATOR : decimalSeparator;
    this.groupSeparator = (groupSeparator == null) ? JST_DEFAULT_GROUP_SEPARATOR : groupSeparator;
    this.useGrouping = (useGrouping == null) ? JST_DEFAULT_USE_GROUPING : booleanValue(useGrouping);
    this.currencySymbol = (currencySymbol == null) ? JST_DEFAULT_CURRENCY_SYMBOL : currencySymbol;
    this.useCurrency = (useCurrency == null) ? JST_DEFAULT_USE_CURRENCY : booleanValue(useCurrency);
    this.negativeParenthesis = (negativeParenthesis == null) ? JST_DEFAULT_NEGATIVE_PARENTHESIS : booleanValue(negativeParenthesis);
    this.groupSize = (groupSize == null) ? JST_DEFAULT_GROUP_SIZE : groupSize;
    this.spaceAfterCurrency = (spaceAfterCurrency == null) ? JST_DEFAULT_SPACE_AFTER_CURRENCY : booleanValue(spaceAfterCurrency);
    this.currencyInside = (currencyInside == null) ? JST_DEFAULT_CURRENCY_INSIDE : booleanValue(currencyInside);
    this.parse = function(string) {
        string = trim(string);
        if (isEmpty(string)) {
            return null
        }
        string = replaceAll(string, this.groupSeparator, "");
        string = replaceAll(string, this.decimalSeparator, ".");
        string = replaceAll(string, this.currencySymbol, "");
        var isNegative = (string.indexOf("(") >= 0) || (string.indexOf("-") >= 0);
        string = replaceAll(string, "(", "");
        string = replaceAll(string, ")", "");
        string = replaceAll(string, "-", "");
        string = trim(string);
        if (!onlySpecified(string, JST_CHARS_NUMBERS + ".")) {
            return null
        }
        var ret = parseFloat(string);
        ret = isNegative ? (ret * -1) : ret;
        return this.round(ret)
    }
    this.format = function(number) {
        if (isNaN(number)) {
            number = this.parse(number)
        }
        if (isNaN(number))
            return null;
        var isNegative = number < 0;
        number = Math.abs(number);
        var ret = "";
        var parts = String(this.round(number)).split(".");
        var intPart = parts[0];
        var decPart = parts.length > 1 ? parts[1] : "";
        if ((this.useGrouping) && (!isEmpty(this.groupSeparator))) {
            var group, temp = "";
            for (var i = intPart.length; i > 0; i -= this.groupSize) {
                group = intPart.substring(intPart.length - this.groupSize);
                intPart = intPart.substring(0, intPart.length - this.groupSize);
                temp = group + this.groupSeparator + temp
            }
            intPart = temp.substring(0, temp.length - 1)
        }
        ret = intPart;
        if (this.decimalDigits != 0) {
            if (this.decimalDigits > 0) {
                while (decPart.length < this.decimalDigits) {
                    decPart += "0"
                }
            }
            if (!isEmpty(decPart)) {
                ret += this.decimalSeparator + decPart
            }
        }
        if (isNegative && !this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")"
            } else {
                ret = "-" + ret
            }
        }
        if (this.useCurrency) {
            ret = this.currencySymbol + (this.spaceAfterCurrency ? " " : "") + ret
        }
        if (isNegative && this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")"
            } else {
                ret = "-" + ret
            }
        }
        return ret
    }
    this.round = function(number) {
        if (this.decimalDigits < 0) {
            return number
        } else if (this.decimalDigits == 0) {
            return Math.round(number)
        }
        var mult = Math.pow(10, this.decimalDigits);
        return Math.round(number * mult) / mult
    }
}
function DateParser(mask, enforceLength, completeFieldsWith) {
    this.base = Parser;
    this.base();
    this.mask = (mask == null) ? JST_DEFAULT_DATE_MASK : String(mask);
    this.enforceLength = (enforceLength == null) ? JST_DEFAULT_ENFORCE_LENGTH : booleanValue(enforceLength);
    this.completeFieldsWith = completeFieldsWith || null;
    this.numberParser = new NumberParser(0);
    this.compiledMask = [];
    var LITERAL = 0;
    var MILLISECOND = 1;
    var SECOND = 2;
    var MINUTE = 3;
    var HOUR_12 = 4;
    var HOUR_24 = 5;
    var DAY = 6;
    var MONTH = 7;
    var YEAR = 8;
    var AM_PM_UPPER = 9;
    var AM_PM_LOWER = 10;
    this.parse = function(string) {
        if (isEmpty(string)) {
            return null
        }
        string = trim(String(string)).toUpperCase();
        var pm = string.indexOf("PM") != -1;
        string = replaceAll(replaceAll(string, "AM", ""), "PM", "");
        var parts = [0, 0, 0, 0, 0, 0, 0];
        var partValues = ["", "", "", "", "", "", ""];
        var entries = [null, null, null, null, null, null, null];
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            var pos = this.getTypeIndex(entry.type);
            if (pos == -1) {
                if (entry.type == LITERAL) {
                    string = string.substr(entry.length)
                } else {}
            } else {
                var partValue = 0;
                if (i == (this.compiledMask.length - 1)) {
                    partValue = string;
                    string = ""
                } else {
                    var nextEntry = this.compiledMask[i + 1];
                    if (nextEntry.type == LITERAL) {
                        var nextPos = string.indexOf(nextEntry.literal);
                        if (nextPos == -1) {
                            partValue = string
                            string = ""
                        } else {
                            partValue = left(string, nextPos);
                            string = string.substr(nextPos)
                        }
                    } else {
                        partValue = string.substring(0, entry.length);
                        string = string.substr(entry.length)
                    }
                }
                if (!onlyNumbers(partValue)) {
                    return null
                }
                partValues[pos] = partValue;
                entries[pos] = entry;
                parts[pos] = isEmpty(partValue) ? this.minValue(parts, entry.type) : this.numberParser.parse(partValue)
            }
        }
        if (!isEmpty(string)) {
            return null
        }
        if (pm && (parts[JST_FIELD_HOUR] < 12)) {
            parts[JST_FIELD_HOUR] += 12
        }
        if (parts[JST_FIELD_MONTH] > 0) {
            parts[JST_FIELD_MONTH]--
        }
        if (parts[JST_FIELD_YEAR] < 100) {
            if (parts[JST_FIELD_YEAR] < 50) {
                parts[JST_FIELD_YEAR] += 2000
            } else {
                parts[JST_FIELD_YEAR] += 1900
            }
        }
        for (var i = 0; i < parts.length; i++) {
            var entry = entries[i]
            var part = parts[i];
            var partValue = partValues[i];
            if (part < 0) {
                return null
            } else if (entry != null) {
                if (this.enforceLength && ((entry.length >= 0) && (partValue.length < entry.length))) {
                    return null
                }
                part = parseInt(partValue, 10);
                if (isNaN(part) && this.completeFieldsWith != null) {
                    part = parts[i] = getDateField(this.completeFieldsWith, i)
                }
                if ((part < this.minValue(parts, entry.type)) || (part > this.maxValue(parts, entry.type))) {
                    return null
                }
            } else if (i == JST_FIELD_DAY && part == 0) {
                part = parts[i] = 1
            }
        }
        return new Date(parts[JST_FIELD_YEAR],parts[JST_FIELD_MONTH],parts[JST_FIELD_DAY],parts[JST_FIELD_HOUR],parts[JST_FIELD_MINUTE],parts[JST_FIELD_SECOND],parts[JST_FIELD_MILLISECOND])
    }
    this.format = function(date) {
        if (!(date instanceof Date)) {
            date = this.parse(date)
        }
        if (date == null) {
            return ""
        }
        var ret = "";
        var parts = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth(), date.getFullYear()];
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            switch (entry.type) {
            case LITERAL:
                ret += entry.literal;
                break;
            case AM_PM_LOWER:
                ret += (parts[JST_FIELD_HOUR] < 12) ? "am" : "pm";
                break;
            case AM_PM_UPPER:
                ret += (parts[JST_FIELD_HOUR] < 12) ? "AM" : "PM";
                break;
            case MILLISECOND:
            case SECOND:
            case MINUTE:
            case HOUR_24:
            case DAY:
                ret += lpad(parts[this.getTypeIndex(entry.type)], entry.length, "0");
                break;
            case HOUR_12:
                ret += lpad(parts[JST_FIELD_HOUR] % 12, entry.length, "0");
                break;
            case MONTH:
                ret += lpad(parts[JST_FIELD_MONTH] + 1, entry.length, "0");
                break;
            case YEAR:
                ret += lpad(right(parts[JST_FIELD_YEAR], entry.length), entry.length, "0");
                break
            }
        }
        return ret
    }
    this.maxValue = function(parts, type) {
        switch (type) {
        case MILLISECOND:
            return 999;
        case SECOND:
            return 59;
        case MINUTE:
            return 59;
        case HOUR_12:
        case HOUR_24:
            return 23;
        case DAY:
            return getMaxDay(parts[JST_FIELD_MONTH], parts[JST_FIELD_YEAR]);
        case MONTH:
            return 12;
        case YEAR:
            return 9999;
        default:
            return 0
        }
    }
    this.minValue = function(parts, type) {
        switch (type) {
        case DAY:
        case MONTH:
        case YEAR:
            return 1;
        default:
            return 0
        }
    }
    this.getFieldType = function(field) {
        switch (field.charAt(0)) {
        case "S":
            return MILLISECOND;
        case "s":
            return SECOND;
        case "m":
            return MINUTE;
        case "h":
            return HOUR_12;
        case "H":
            return HOUR_24;
        case "d":
            return DAY;
        case "M":
            return MONTH;
        case "y":
            return YEAR;
        case "a":
            return AM_PM_LOWER;
        case "A":
            return AM_PM_UPPER;
        default:
            return LITERAL
        }
    }
    this.getTypeIndex = function(type) {
        switch (type) {
        case MILLISECOND:
            return JST_FIELD_MILLISECOND;
        case SECOND:
            return JST_FIELD_SECOND;
        case MINUTE:
            return JST_FIELD_MINUTE;
        case HOUR_12:
        case HOUR_24:
            return JST_FIELD_HOUR;
        case DAY:
            return JST_FIELD_DAY;
        case MONTH:
            return JST_FIELD_MONTH;
        case YEAR:
            return JST_FIELD_YEAR;
        default:
            return -1
        }
    }
    var Entry = function(type, length, literal) {
        this.type = type;
        this.length = length || -1;
        this.literal = literal
    }
    this.compile = function() {
        var current = "";
        var old = "";
        var part = "";
        this.compiledMask = [];
        for (var i = 0; i < this.mask.length; i++) {
            current = this.mask.charAt(i);
            if ((part == "") || (current == part.charAt(0))) {
                part += current
            } else {
                var type = this.getFieldType(part);
                this.compiledMask[this.compiledMask.length] = new Entry(type,part.length,part);
                part = "";
                i--
            }
        }
        if (part != "") {
            var type = this.getFieldType(part);
            this.compiledMask[this.compiledMask.length] = new Entry(type,part.length,part)
        }
    }
    this.setMask = function(mask) {
        this.mask = mask;
        this.compile()
    }
    this.setMask(this.mask)
}
function BooleanParser(trueValue, falseValue, useBooleanValue) {
    this.base = Parser;
    this.base();
    this.trueValue = trueValue || JST_DEFAULT_TRUE_VALUE;
    this.falseValue = falseValue || JST_DEFAULT_FALSE_VALUE;
    this.useBooleanValue = useBooleanValue || JST_DEFAULT_USE_BOOLEAN_VALUE;
    this.parse = function(string) {
        if (this.useBooleanValue && booleanValue(string)) {
            return true
        }
        return string == JST_DEFAULT_TRUE_VALUE
    }
    this.format = function(bool) {
        return booleanValue(bool) ? this.trueValue : this.falseValue
    }
}
function StringParser() {
    this.base = Parser;
    this.base();
    this.parse = function(string) {
        return String(string)
    }
    this.format = function(string) {
        return String(string)
    }
}
function MapParser(map, directParse) {
    this.base = Parser;
    this.base();
    this.map = isInstance(map, Map) ? map : new Map();
    this.directParse = booleanValue(directParse);
    this.parse = function(value) {
        if (directParse) {
            return value
        }
        var pairs = this.map.getPairs();
        for (var k = 0; k < pairs.length; k++) {
            if (value == pairs[k].value) {
                return pairs[k].key
            }
        }
        return null
    }
    this.format = function(value) {
        return this.map.get(value)
    }
}
function EscapeParser(extraChars, onlyExtra) {
    this.base = Parser;
    this.base();
    this.extraChars = extraChars || "";
    this.onlyExtra = booleanValue(onlyExtra);
    this.parse = function(value) {
        if (value == null) {
            return null
        }
        return unescapeCharacters(String(value), extraChars, onlyExtra)
    }
    this.format = function(value) {
        if (value == null) {
            return null
        }
        return escapeCharacters(String(value), onlyExtra)
    }
}
function CustomParser(formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    this.formatFunction = formatFunction || function(value) {
        return value
    }
    ;
    this.parseFunction = parseFunction || function(value) {
        return value
    }
    ;
    this.parse = function(value) {
        return parseFunction.apply(this, arguments)
    }
    this.format = function(value) {
        return formatFunction.apply(this, arguments)
    }
}
function WrapperParser(wrappedParser, formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    this.wrappedParser = wrappedParser || new CustomParser();
    this.formatFunction = formatFunction || function(value) {
        return value
    }
    ;
    this.parseFunction = parseFunction || function(value) {
        return value
    }
    ;
    this.format = function(value) {
        var formatted = this.wrappedParser.format.apply(this.wrappedParser, arguments);
        var args = [];
        args[0] = formatted;
        args[1] = arguments[0];
        for (var i = 1, len = arguments.length; i < len; i++) {
            args[i + 1] = arguments[i]
        }
        return formatFunction.apply(this, args)
    }
    this.parse = function(value) {
        var parsed = parseFunction.apply(this, arguments);
        arguments[0] = parsed;
        return this.wrappedParser.parse.apply(this.wrappedParser, arguments)
    }
}

//Will InputMask be applied when the user strokes a backspace?
var JST_NUMBER_MASK_APPLY_ON_BACKSPACE = true;
//Will InputMask validate the text on the onblur event?
var JST_MASK_VALIDATE_ON_BLUR = true;
//Allow negative values by default on the NumberMask
var JST_DEFAULT_ALLOW_NEGATIVE = true;
//Will the NumberMask digits be from left to right by default?
var JST_DEFAULT_LEFT_TO_RIGHT = false;
//Validates the typed text on DateMask?
var JST_DEFAULT_DATE_MASK_VALIDATE = true;
//The default message for DateMask validation errors
var JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE = "";
//The default padFunction for years
var JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION = getFullYear;
//The default padFunction for am/pm field
var JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION = function(value) {
    if (isEmpty(value)) return "";
    switch (left(value, 1)) {
        case 'a': return 'am';
        case 'A': return 'AM';
        case 'p': return 'pm';
        case 'P': return 'PM';
    }
    return value;
}
//The default decimal separator for decimal separator for the JST_MASK_DECIMAL
//Note that this does not affect the NumberMask instances
var JST_FIELD_DECIMAL_SEPARATOR = new Literal(typeof(JST_DEFAULT_DECIMAL_SEPARATOR) == "undefined" ? "," : JST_DEFAULT_DECIMAL_SEPARATOR);
//The SizeLimit default output text
var JST_DEFAULT_LIMIT_OUTPUT_TEXT = "${left}";

///////////////////////////////////////////////////////////////////////////////
//Temporary variables for the masks
numbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers.optional = true;
oneToTwoNumbers = new Input(JST_CHARS_NUMBERS, 1, 2);
year = new Input(JST_CHARS_NUMBERS, 1, 4, getFullYear);
dateSep = new Literal("/");
dateTimeSep = new Literal(" ");
timeSep = new Literal(":");

/*
 * Some prebuilt masks
 */
var JST_MASK_NUMBERS       = [numbers];
var JST_MASK_DECIMAL       = [numbers, JST_FIELD_DECIMAL_SEPARATOR, optionalNumbers];
var JST_MASK_UPPER         = [new Upper(JST_CHARS_LETTERS)];
var JST_MASK_LOWER         = [new Lower(JST_CHARS_LETTERS)];
var JST_MASK_CAPITALIZE    = [new Capitalize(JST_CHARS_LETTERS)];
var JST_MASK_LETTERS       = [new Input(JST_CHARS_LETTERS)];
var JST_MASK_ALPHA         = [new Input(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_UPPER   = [new Upper(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_LOWER   = [new Lower(JST_CHARS_ALPHA)];
var JST_MASK_DATE          = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year];
var JST_MASK_DATE_TIME     = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];
var JST_MASK_DATE_TIME_SEC = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];

//Clear the temporary variables
delete numbers;
delete optionalNumbers;
delete oneToTwoNumbers;
delete year;
delete dateSep;
delete dateTimeSep;
delete timeSep;

/* We ignore the following characters on mask:
45 - insert, 46 - del (not on konqueror), 35 - end, 36 - home, 33 - pgup,
34 - pgdown, 37 - left, 39 - right, 38 - up, 40 - down,
127 - del on konqueror, 4098 shift + tab on konqueror */
var JST_IGNORED_KEY_CODES = [45, 35, 36, 33, 34, 37, 39, 38, 40, 127, 4098];
if (navigator.userAgent.toLowerCase().indexOf("khtml") < 0) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = 46;
}
//All other with keyCode < 32 are also ignored
for (var i = 0; i < 32; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}
//F1 - F12 are also ignored
for (var i = 112; i <= 123; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main InputMask class.
 * Parameters:
 *    fields: The mask fields
 *    control: The reference to the control that is being masked
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function InputMask(fields, control, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {

    //Check if the fields are a String
    if (isInstance(fields, String)) {
        fields = maskBuilder.parse(fields);
    } else if (isInstance(fields, MaskField)) {
        fields = [fields];
    }

    //Check if the fields are a correct array of fields
    if (isInstance(fields, Array)) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!isInstance(field, MaskField)) {
                alert("Invalid field: " + field);
                return;
            }
        }
    } else {
        alert("Invalid field array: " + fields);
        return;
    }

    this.fields = fields;

    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }

    //Set the control's reference to the mask descriptor
    this.control.mask = this;
    this.control.pad = false;
    this.control.ignore = false;

    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        this.keyCode = typedCode(event);

        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);

    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        //Get what's been typed
        var keyCode = this.keyCode || typedCode(event);
        var ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //When a range is selected, clear it
        if (!ignore) {
            var range = getInputSelectionRange(this);
            if (range != null && range[0] != range[1]) {
                replaceSelection(this, "");
            }
        }

        //Prepre the variables
        this.caretPosition = getCaret(this);
        this.setFixedLiteral = null;
        var typedChar = this.typedChar = ignore ? "" : String.fromCharCode(typedCode(event));
        var fieldDescriptors = this.fieldDescriptors = this.mask.getCurrentFields();
        var currentFieldIndex = this.currentFieldIndex = this.mask.getFieldIndexUnderCaret();

        //Check if any field accept the typed key
        var accepted = false;
        if (!ignore) {
            var currentField = this.mask.fields[currentFieldIndex];
            accepted = currentField.isAccepted(typedChar);
            if (accepted) {
                //Apply basic transformations
                if (currentField.upper) {
                    typedChar = this.typedChar = typedChar.toUpperCase();
                } else if (currentField.lower) {
                    typedChar = this.typedChar = typedChar.toLowerCase();
                }
                if (currentFieldIndex == this.mask.fields.length - 2) {
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal) {
                        //When this field is the last input and the next field is literal, if this field is complete, append the literal also
                        var currentFieldIsComplete = !currentField.acceptsMoreText(fieldDescriptors[currentFieldIndex].value + typedChar);
                        if (currentFieldIsComplete) {
                            this.setFixedLiteral = nextFieldIndex;
                        }
                    }
                }
            } else {
                var previousFieldIndex = currentFieldIndex - 1;
                if (currentFieldIndex > 0 && this.mask.fields[previousFieldIndex].literal && isEmpty(fieldDescriptors[previousFieldIndex].value)) {
                    //When passed by the previous field without it having a value, force it to have a value
                    this.setFixedLiteral = previousFieldIndex;
                    accepted = true;
                } else if (currentFieldIndex < this.mask.fields.length - 1) {
                    //When typed the next literal, pad this field and go to the next one
                    var descriptor = fieldDescriptors[currentFieldIndex];
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal && nextField.text.indexOf(typedChar) >= 0) {
                        //Mark the field as setting the current literal
                        this.setFixedLiteral = nextFieldIndex;
                        accepted = true;
                    }
                } else if (currentFieldIndex == this.mask.fields.length - 1 && currentField.literal) {
                    // When the mask ends with a literal and it's the current field, force it to have a value
                    this.setFixedLiteral = currentFieldIndex;
                    accepted = true;
                }
            }
        }

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        //Return on ignored keycodes
        if (ignore) {
            return;
        }

        //Apply the mask
        var shouldApplyMask = !ignore && accepted;
        if (shouldApplyMask) {
            applyMask(this.mask, false);
        }

        this.keyCode = null;
        return preventDefault(event);
    }
    observeEvent(this.control, "keypress", onKeyPress);

    //The KeyUp event is no longer used, and will be kept for backward compatibility
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keyup", onKeyUp);

    //Add support for onchange event
    function onFocus (event) {
        this._lastValue = this.value;
    }
    observeEvent(this.control, "focus", onFocus);

    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }

        document.fieldOnBlur = this;
        try {
            var valueChanged = this._lastValue != this.value;

            if (valueChanged && JST_MASK_VALIDATE_ON_BLUR) {
                applyMask(this.mask, true);
            }

            if (this.mask.changeFunction != null) {
                if (valueChanged && this.mask.changeFunction != null) {
                    var e = {};
                    for (property in event) {
                        e[property] = event[property];
                    }
                    e.type = "change";
                    invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
                }
            }

            //Check for extra function on blur
            if (this.mask.blurFunction != null) {
                var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
                if (ret == false) {
                    return preventDefault(event);
                }
            }
            return true;
        } finally {
            document.fieldOnBlur = null;
        }
    }
    observeEvent(this.control, "blur", onBlur);

    //Method to determine whether the mask fields are complete
    this.isComplete = function () {

        //Ensures the field values will be parsed
        applyMask(this, true);

        //Get the fields
        var descriptors = this.getCurrentFields();

        //Check if there is some value
        if (descriptors == null || descriptors.length == 0) {
            return false;
        }

        //Check for completed values
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input && !field.isComplete(descriptors[i].value) && !field.optional) {
                return false;
            }
        }
        return true;
    }

    //Method to force a mask update
    this.update = function () {
        applyMask(this, true);
    }

    //Returns an array with objects containing values, start position and end positions
    this.getCurrentFields = function(value) {
        value = value || this.control.value;
        var descriptors = [];
        var currentIndex = 0;
        //Get the value for input fields
        var lastInputIndex = -1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            var fieldValue = "";
            var descriptor = {};
            if (field.literal) {
                if (lastInputIndex >= 0) {
                    var lastInputField = this.fields[lastInputIndex];
                    var lastInputDescriptor = descriptors[lastInputIndex];
                    //When no text is accepted by the last input field,
                    //assume the next input will be used, so, assume the value for this literal as it's text
                    if (field.text.indexOf(mid(value, currentIndex, 1)) < 0 && lastInputField.acceptsMoreText(lastInputDescriptor.value)) {
                        descriptor.begin = -1;
                    } else {
                        descriptor.begin = currentIndex;
                    }
                }
                if (currentIndex >= value.length) {
                    break;
                }
                if (value.substring(currentIndex, currentIndex + field.text.length) == field.text) {
                    currentIndex += field.text.length;
                }
            } else {
                //Check if there's a value
                var upTo = field.upTo(value, currentIndex);
                if (upTo < 0 && currentIndex >= value.length) {
                    break;
                }
                fieldValue = upTo < 0 ? "" : field.transformValue(value.substring(currentIndex, upTo + 1));
                descriptor.begin = currentIndex;
                descriptor.value = fieldValue;
                currentIndex += fieldValue.length;
                lastInputIndex = i;
            }
            descriptors[i] = descriptor;
        }

        //Complete the descriptors
        var lastWithValue = descriptors.length - 1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (i > lastWithValue) {
                descriptors[i] = {value: "", begin: -1};
            } else {
                // Literals with inputs on both sides that have values also have values
                if (field.literal) {
                    var descriptor = descriptors[i];

                    //Literals that have been set begin < 0 will have no value
                    if (descriptor.begin < 0) {
                        descriptor.value = "";
                        continue;
                    }

                    //Find the previous input value
                    var previousField = null;
                    var previousValueComplete = false;
                    for (var j = i - 1; j >= 0; j--) {
                        var current = this.fields[j];
                        if (current.input) {
                            previousField = current;
                            previousValueComplete = current.isComplete(descriptors[j].value);
                            if (previousValueComplete) {
                                break;
                            } else {
                                previousField = null;
                            }
                        }
                    }

                    //Find the next input value
                    var nextField = null;
                    var nextValueExists = null;
                    for (var j = i + 1; j < this.fields.length && j < descriptors.length; j++) {
                        var current = this.fields[j];
                        if (current.input) {
                            nextField = current;
                            nextValueExists = !isEmpty(descriptors[j].value);
                            if (nextValueExists) {
                                break;
                            } else {
                                nextField = null;
                            }
                        }
                    }
                    //3 cases for using the value:
                    // * both previous and next inputs have complete values
                    // * no previous input and the next has complete value
                    // * no next input and the previous has complete value
                    if ((previousValueComplete && nextValueExists) || (previousField == null && nextValueExists) || (nextField == null && previousValueComplete)) {
                        descriptor.value = field.text;
                    } else {
                        descriptor.value = "";
                        descriptor.begin = -1;
                    }
                }
            }
        }
        return descriptors;
    }

    //Returns the field index under the caret
    this.getFieldIndexUnderCaret = function() {
        var value = this.control.value;
        var caret = getCaret(this.control);
        //When caret operations are not supported, assume it's at text end
        if (caret == null) caret = value.length;
        var lastPosition = 0;
        var lastInputIndex = null;
        var lastInputAcceptsMoreText = false;
        var lastWasLiteral = false;
        var returnNextInput = isEmpty(value) || caret == 0;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input) {
                //Check whether should return the next input field
                if (returnNextInput || lastPosition > value.length) {
                    return i;
                }
                //Find the field value
                var upTo = field.upTo(value, lastPosition)
                if (upTo < 0) {
                    return i; //lastInputIndex == null || lastWasLiteral ? i : lastInputIndex;
                }
                //Handle unlimited fields
                if (field.max < 0) {
                    var nextField = null;
                    if (i < this.fields.length - 1) {
                        nextField = this.fields[i + 1];
                    }
                    if (caret - 1 <= upTo && (nextField == null || nextField.literal)) {
                        return i;
                    }
                }
                var fieldValue = value.substring(lastPosition, upTo + 1);
                var acceptsMoreText = field.acceptsMoreText(fieldValue);
                var positionToCheck = acceptsMoreText ? caret - 1 : caret
                if (caret >= lastPosition && positionToCheck <= upTo) {
                    return i;
                }
                lastInputAcceptsMoreText = acceptsMoreText;
                lastPosition = upTo + 1;
                lastInputIndex = i;
            } else {
                if (caret == lastPosition) {
                    returnNextInput = !lastInputAcceptsMoreText;
                }
                lastPosition += field.text.length;
            }
            lastWasLiteral = field.literal;
        }
        return this.fields.length - 1;
    }

    //Method to determine if the mask is only for filtering which chars can be typed
    this.isOnlyFilter = function () {
        if (this.fields == null || this.fields.length == 0) {
            return true;
        }
        if (this.fields.length > 1) {
            return false;
        }
        var field = this.fields[0];
        return field.input && field.min <= 1 && field.max <= 0;
    }

    //Returns if this mask changes the text case
    this.transformsCase = function() {
        if (this.fields == null || this.fields.length == 0) {
            return false;
        }
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.upper || field.lower || field.capitalize) {
                return true;
            }
        }
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main NumberMask class.
 * Parameters:
 *    parser: The NumberParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    maxIntegerDigits: The limit for integer digits (excluding separators).
 *                      Default: -1 (no limit)
 *    allowNegative: Should negative values be allowed? Default: see the
 *                   value of the JST_DEFAULT_ALLOW_NEGATIVE constant.
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    leftToRight: Indicates if the input will be processed from left to right.
 *                 Default: the JST_DEFAULT_LEFT_TO_RIGHT constant
 *    changeFunction: The additional function instance used on the change event
 */
function NumberMask(parser, control, maxIntegerDigits, allowNegative, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, leftToRight, changeFunction) {
    //Validate the parser
    if (!isInstance(parser, NumberParser)) {
        alert("Illegal NumberParser instance");
        return;
    }
    this.parser = parser;

    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }

    //Get the additional properties
    this.maxIntegerDigits = maxIntegerDigits || -1;
    this.allowNegative = allowNegative || JST_DEFAULT_ALLOW_NEGATIVE;
    this.leftToRight = leftToRight || JST_DEFAULT_LEFT_TO_RIGHT;

    //Set the control's reference to the mask and other aditional flags
    this.control.mask = this;
    this.control.ignore = false;
    this.control.swapSign = false;
    this.control.toDecimal = false;
    this.control.oldValue = this.control.value;

    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        this.ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        return true;
    }
    observeEvent(this.control, "keydown", onKeyDown);

    //The KeyPress event will filter the keys
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        if (this.ignore) {
            return true;
        }

        //Store the old value
        this.oldValue = this.value;

        //Check for the minus sign
        if (typedChar == '-') {
            if (this.mask.allowNegative) {
                if (this.value == '') {
                    //Typing the negative sign on the empty field. ok.
                    this.ignore = true;
                    return true;
                }
                //The field is not empty. Set the swapSign flag, so applyNumberMask will do the job
                this.swapSign = true;
                applyNumberMask(this.mask, false, false);
            }
            return preventDefault(event);
        }
        //Check for the decimal separator
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator && this.mask.parser.decimalDigits != 0) {
            this.toDecimal = true;
            if (this.supportsCaret) {
                return preventDefault(event);
            }
        }
        this.swapSign = false;
        this.toDecimal = false;
        this.accepted = false;
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator) {
            if (this.mask.parser.decimalDigits == 0 || this.value.indexOf(this.mask.parser.decimalSeparator) >= 0) {
                this.accepted = true;
                return preventDefault(event);
            } else {
                return true;
            }
        }
        this.accepted = onlyNumbers(typedChar);
        if (!this.accepted) {
            return preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);

    //The KeyUp event will apply the mask
    function onKeyUp (event) {
        //Check an invalid parser
        if (this.mask.parser.decimalDigits < 0 && !this.mask.leftToRight) {
            alert("A NumberParser with unlimited decimal digits is not supported on NumberMask when the leftToRight property is false");
            this.value = "";
            return false;
        }

        if (window.event) {
            event = window.event;
        }
        //Check if it's not an ignored key
        var keyCode = typedCode(event);
        var isBackSpace = (keyCode == 8) && JST_NUMBER_MASK_APPLY_ON_BACKSPACE;
        if (this.supportsCaret && (this.toDecimal || (!this.ignore && this.accepted) || isBackSpace)) {
            //If the number was already 0 and we stroke a backspace, clear the text value
            if (isBackSpace && this.mask.getAsNumber() == 0) {
                this.value = "";
            }
            applyNumberMask(this.mask, false, isBackSpace);
        }
        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        return true;
    }
    observeEvent(this.control, "keyup", onKeyUp);

    //Add support for onchange event
    function onFocus (event) {
        if (this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);

    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }

        if (JST_MASK_VALIDATE_ON_BLUR) {
            if (this.value == '-') {
                this.value = '';
            } else {
                applyNumberMask(this.mask, true, false);
            }
        }

        if (this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.mask.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
            }
        }

        //Check for extra function on keydown
        if (this.mask.blurFunction != null) {
            var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        return true;
    }
    observeEvent(this.control, "blur", onBlur);

    //Method to determine if the mask is all complete
    this.isComplete = function() {
        return this.control.value != "";
    }

    //Returns the control value as a number
    this.getAsNumber = function() {
        var number = this.parser.parse(this.control.value);
        if (isNaN(number)) {
            number = null;
        }
        return number;
    }

    //Sets the control value as a number
    this.setAsNumber = function(number) {
        var value = "";
        if (isInstance(number, Number)) {
            value = this.parser.format(number);
        }
        this.control.value = value;
        this.update();
    }

    //Method to force a mask update
    this.update = function() {
        applyNumberMask(this, true, false);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main DateMask class.
 * Parameters:
 *    parser: The DateParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    validate: Validate the control on the onblur event? Default: The JST_DEFAULT_DATE_MASK_VALIDATE value
 *    validationMessage: Message alerted on validation on fail. The ${value}
 *       placeholder may be used as a substituition for the field value, and ${mask}
 *       for the parser mask. Default: the JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE value
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function DateMask(parser, control, validate, validationMessage, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {

    //Validate the parser
    if (isInstance(parser, String)) {
        parser = new DateParser(parser);
    }
    if (!isInstance(parser, DateParser)) {
        alert("Illegal DateParser instance");
        return;
    }
    this.parser = parser;

    //Set a control to keyPressFunction, to ensure the validation won't be shown twice
    this.extraKeyPressFunction = keyPressFunction || null;
    function maskKeyPressFunction (event, dateMask) {
        dateMask.showValidation = true;
        if (dateMask.extraKeyPressFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraKeyPressFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }

    //Set the validation to blurFunction, plus the informed blur function
    this.extraBlurFunction = blurFunction || null;
    function maskBlurFunction (event, dateMask) {
        var control = dateMask.control;
        if (dateMask.validate && control.value.length > 0) {
            var controlValue = control.value.toUpperCase();
            controlValue = controlValue.replace(/A[^M]/, "AM");
            controlValue = controlValue.replace(/A$/, "AM");
            controlValue = controlValue.replace(/P[^M]/, "PM");
            controlValue = controlValue.replace(/P$/, "PM");
            var date = dateMask.parser.parse(controlValue);
            if (date == null) {
                var msg = dateMask.validationMessage;
                if (dateMask.showValidation && !isEmpty(msg)) {
                    dateMask.showValidation = false;
                    msg = replaceAll(msg, "${value}", control.value);
                    msg = replaceAll(msg, "${mask}", dateMask.parser.mask);
                    alert(msg);
                }
                control.value = "";
                control.focus();
            } else {
                control.value = dateMask.parser.format(date);
            }
        }
        if (dateMask.extraBlurFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraBlurFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }

    //Build the fields array
    var fields = new Array();
    var old = '';
    var mask = this.parser.mask;
    while (mask.length > 0) {
        var field = mask.charAt(0);
        var size = 1;
        var maxSize = -1;
        var padFunction = null;
        while (mask.charAt(size) == field) {
            size++;
        }
        mask = mid(mask, size);
        var accepted = JST_CHARS_NUMBERS;
        switch (field) {
            case 'd': case 'M': case 'h': case 'H': case 'm': case 's':
                maxSize = 2;
                break;
            case 'y':
                padFunction = JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION;
                if (size == 2) {
                    maxSize = 2;
                } else {
                    maxSize = 4;
                }
                break;
            case 'a': case 'A': case 'p': case 'P':
                maxSize = 2;
                padFunction = JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION;
                accepted = 'aApP';
                break;
            case 'S':
                maxSize = 3;
                break;
        }
        var input;
        if (maxSize == -1) {
            input = new Literal(field);
        } else {
            input = new Input(accepted, size, maxSize);
            if (padFunction == null) {
                input.padFunction = new Function("text", "return lpad(text, " + maxSize + ", '0')");
            } else {
                input.padFunction = padFunction;
            }
        }
        fields[fields.length] = input;
    }

    //Initialize the superclass
    this.base = InputMask;
    this.base(fields, control, maskKeyPressFunction, keyDownFunction, keyUpFunction, maskBlurFunction, updateFunction, changeFunction);

    //Store the additional variables
    this.validate = validate == null ? JST_DEFAULT_DATE_MASK_VALIDATE : booleanValue(validate);
    this.showValidation = true;
    this.validationMessage = validationMessage || JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE;
    this.control.dateMask = this;

    //Returns the control value as a date
    this.getAsDate = function() {
        return this.parser.parse(this.control.value);
    }

    //Sets the control value as a date
    this.setAsDate = function(date) {
        var value = "";
        if (isInstance(date, Date)) {
            value = this.parser.format(date);
        }
        this.control.value = value;
        this.update();
    }
}


///////////////////////////////////////////////////////////////////////////////
/*
 * This class limits the size of an input (mainly textAreas, that does not have a
 * maxLength attribute). Optionally, can use another element to output the number
 * of characters on the element and/or the number of characters left.
 * Like the masks, this class uses the keyUp and blur events, may use additional
 * callbacks for those events.
 * Parameters:
 *     control: The textArea reference or name
 *     maxLength: The maximum text length
 *     output: The element to output the number of characters left. Default: none
 *     outputText: The text. May use two placeholders:
 *         ${size} - Outputs the current text size
 *         ${left} - Outputs the number of characters left
 *         ${max} - Outputs the maximum number characters that the element accepts
 *         Examples: "${size} / ${max}", "You typed ${size}, and have ${left} more characters to type"
 *         Default: "${left}"
 *     updateFunction: If set, this function will be called when the text is updated. So, custom actions
 *         may be performed. The arguments passed to the function are: The control, the text size, the maximum size
 *         and the number of characters left.
 *     keyUpFunction: The additional handler to the keyUp event. Default: none
 *     blurFunction: The additional handler to the blur event. Default: none
 *     keyPressFunction: The additional handler to the keyPress event. Default: none
 *     keyDownFunction: The additional handler to the keyDown event. Default: none
 *     changeFunction: The additional function instance used on the change event. Default: none
 */
function SizeLimit(control, maxLength, output, outputText, updateFunction, keyUpFunction, blurFunction, keyDownFunction, keyPressFunction, changeFunction) {
    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to limit size");
        return;
    } else {
        this.control = control;
        prepareForCaret(control);
    }

    if (!isInstance(maxLength, Number)) {
        alert("Invalid maxLength");
        return;
    }

    //Get the additional properties
    this.control = control;
    this.maxLength = maxLength;
    this.output = output || null;
    this.outputText = outputText || JST_DEFAULT_LIMIT_OUTPUT_TEXT;
    this.updateFunction = updateFunction || null;
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.changeFunction = changeFunction || null;

    //Set the control's reference to the mask descriptor
    this.control.sizeLimit = this;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        this.ignore = inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.sizeLimit.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyDownFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);

    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);
        var allowed = this.ignore || this.value.length < this.sizeLimit.maxLength;

        //Check for extra function on keypress
        if (this.sizeLimit.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyPressFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        if (!allowed) {
            preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);

    //The KeyUp event handler
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keypress
        if (this.sizeLimit.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyUpFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return checkSizeLimit(this, false);
    }
    observeEvent(this.control, "keyup", onKeyUp);

    //Add support for onchange event
    function onFocus (event) {
        if (this.mask && this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);

    //The Blur event handler
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }

        var ret = checkSizeLimit(this, true);

        if (this.mask && this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.sizeLimit.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.sizeLimit.changeFunction, [e, this.sizeLimit]);
            }
        }

        //Check for extra function on blur
        if (this.sizeLimit.blurFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.blurFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return ret;
    }
    observeEvent(this.control, "blur", onBlur);

    // Method used to update the limit
    this.update = function() {
        checkSizeLimit(this.control, true);
    }

    //Initially check the size limit
    this.update();
}

//Function to determine if a given object is a valid control to mask
function validateControlToMask(control) {
    control = getObject(control)
    if (control == null) {
        return false;
    } else if (!(control.type) || (!inArray(control.type, ["text", "textarea", "password"]))) {
        return false;
    } else {
        //Avoid memory leak on MSIE
        if (/MSIE/.test(navigator.userAgent) && !window.opera) {
            observeEvent(self, "unload", function() {
                control.mask = control.dateMask = control.sizeLimit = null;
            });
        }
        return control;
    }
}

//Function to handle the mask format
function applyMask(mask, isBlur) {
    var fields = mask.fields;

    //Return if there are fields to process
    if ((fields == null) || (fields.length == 0)) {
        return;
    }

    var control = mask.control;
    if (isEmpty(control.value) && isBlur) {
        return true;
    }

    var value = control.value;
    var typedChar = control.typedChar;
    var typedIndex = control.caretPosition;
    var setFixedLiteral = control.setFixedLiteral;
    var currentFieldIndex = mask.getFieldIndexUnderCaret();
    var fieldDescriptors = mask.getCurrentFields();
    var currentDescriptor = fieldDescriptors[currentFieldIndex];

    //Apply the typed char
    if (isBlur || !isEmpty(typedChar)) {
        var out = new StringBuffer(fields.length);
        var caretIncrement = 1;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var descriptor = fieldDescriptors[i];
            var padValue = (setFixedLiteral == i + 1);
            if (currentFieldIndex == i + 1 && field.literal && typedIndex == descriptor.begin) {
                //Increment the caret when "passing by" a literal
                caretIncrement += field.text.length;
            } else if (field.literal && currentFieldIndex > i) {
                //Passed through a literal field
                descriptor.value = field.text;
                caretIncrement += field.text.length + 1;
            } else if (currentFieldIndex == i) {
                //Append the typed char
                if (!isEmpty(typedIndex) && !isEmpty(typedChar) && field.isAccepted(typedChar)) {
                    var fieldStartsAt = descriptor.begin < 0 ? value.length : descriptor.begin;
                    var insertAt = Math.max(0, typedIndex - fieldStartsAt);
                    if (field.input && field.acceptsMoreText(descriptor.value)) {
                        //When more text is accepted, insert the typed char
                        descriptor.value = insertString(descriptor.value, insertAt, typedChar);
                    } else {
                        //No more text is accepted, overwrite
                        var prefix = left(descriptor.value, insertAt);
                        var suffix = mid(descriptor.value, insertAt + 1);
                        descriptor.value = prefix + typedChar + suffix;
                    }
                }
            }
            //Pad the last field on blur
            if (isBlur && !isEmpty(descriptor.value) && i == fields.length - 1 && field.input) {
                padValue = true
            }
            //Check if the value should be padded
            if (padValue) {
                var oldValue = descriptor.value;
                descriptor.value = field.pad(descriptor.value);
                var inc = descriptor.value.length - oldValue.length;
                if (inc > 0) {
                    caretIncrement += inc;
                }
            }
            out.append(descriptor.value);
        }
        value = out.toString();
    }

    //Build the output
    fieldDescriptors = mask.getCurrentFields(value);
    var out = new StringBuffer(fields.length);
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var descriptor = fieldDescriptors[i];
        //When a literal is fixed or the next field has value, append it forcefully
        if (field.literal && (setFixedLiteral == i || (i < fields.length - 1 && !isEmpty(fieldDescriptors[i + 1].value)))) {
            descriptor.value = field.text;
        }
        out.append(descriptor.value);
    }

    //Update the control value
    control.value = out.toString();
    if (control.caretPosition != null && !isBlur) {
        if (control.pad) {
            setCaretToEnd(control);
        } else {
            setCaret(control, typedIndex + control.value.length - value.length + caretIncrement);
        }
    }

    //Call the update function if present
    if (mask.updateFunction != null) {
        mask.updateFunction(mask);
    }

    //Clear the control variables
    control.typedChar = null;
    control.fieldDescriptors = null;
    control.currentFieldIndex = null;

    return false;
}

//Retrieve the number of characters that are not digits up to the caret
function nonDigitsToCaret(value, caret) {
    if (caret == null) {
        return null;
    }
    var nonDigits = 0;
    for (var i = 0; i < caret && i < value.length; i++) {
        if (!onlyNumbers(value.charAt(i))) {
            nonDigits++;
        }
    }
    return nonDigits;
}

//Function to handle the number mask format
function applyNumberMask(numberMask, isBlur, isBackSpace) {
    var control = numberMask.control;
    var value = control.value;
    if (value == "") {
        return true;
    }
    var parser = numberMask.parser;
    var maxIntegerDigits = numberMask.maxIntegerDigits;
    var swapSign = false;
    var toDecimal = false;
    var leftToRight = numberMask.leftToRight;
    if (control.swapSign == true) {
        swapSign = true;
        control.swapSign = false;
    }
    if (control.toDecimal == true) {
        toDecimal = value.indexOf(parser.decimalSeparator) < 0;
        control.toDecimal = false;
    }
    var intPart = "";
    var decPart = "";
    var isNegative = value.indexOf('-') >= 0 || value.indexOf('(') >= 0;
    if (value == "") {
        value = parser.format(0);
    }
    value = replaceAll(value, parser.groupSeparator, '')
    value = replaceAll(value, parser.currencySymbol, '')
    value = replaceAll(value, '-', '')
    value = replaceAll(value, '(', '')
    value = replaceAll(value, ')', '')
    value = replaceAll(value, ' ', '')
    var pos = value.indexOf(parser.decimalSeparator);
    var hasDecimal = (pos >= 0);
    var caretAdjust = 0;

    //Check if the handling will be from left to right or right to left
    if (leftToRight) {
        //The left to right is based on the decimal separator position
        if (hasDecimal) {
            intPart = value.substr(0, pos);
            decPart = value.substr(pos + 1);
        } else {
            intPart = value;
        }
        if (isBlur && parser.decimalDigits > 0) {
            decPart = rpad(decPart, parser.decimalDigits, '0');
        }
    } else {
        //The right to left is based on a fixed decimal size
        var decimalDigits = parser.decimalDigits;
        value = replaceAll(value, parser.decimalSeparator, '');
        intPart = left(value, value.length - decimalDigits);
        decPart = lpad(right(value, decimalDigits), decimalDigits, '0');
    }
    var zero = onlySpecified(intPart + decPart, '0');

    //Validate the input
    if ((!isEmpty(intPart) && !onlyNumbers(intPart)) || (!isEmpty(decPart) && !onlyNumbers(decPart))) {
        control.value = control.oldValue;
        return true;
    }
    if (leftToRight && parser.decimalDigits >= 0 && decPart.length > parser.decimalDigits) {
        decPart = decPart.substring(0, parser.decimalDigits);
    }
    if (maxIntegerDigits >= 0 && intPart.length > maxIntegerDigits) {
        caretAdjust = maxIntegerDigits - intPart.length - 1;
        intPart = left(intPart, maxIntegerDigits);
    }
    //Check the sign
    if (zero) {
        isNegative = false;
    } else if (swapSign) {
        isNegative = !isNegative;
    }
    //Format the integer part with decimal separators
    if (!isEmpty(intPart)) {
        while (intPart.charAt(0) == '0') {
            intPart = intPart.substr(1);
        }
    }
    if (isEmpty(intPart)) {
        intPart = "0";
    }
    if ((parser.useGrouping) && (!isEmpty(parser.groupSeparator))) {
        var group, temp = "";
        for (var i = intPart.length; i > 0; i -= parser.groupSize) {
            group = intPart.substring(intPart.length - parser.groupSize);
            intPart = intPart.substring(0, intPart.length - parser.groupSize);
            temp = group + parser.groupSeparator + temp;
        }
        intPart = temp.substring(0, temp.length-1);
    }
    //Format the output
    var out = new StringBuffer();
    var oneFormatted = parser.format(isNegative ? -1 : 1);
    var appendEnd = true;
    pos = oneFormatted.indexOf('1');
    out.append(oneFormatted.substring(0, pos));
    out.append(intPart);

    //Build the output
    if (leftToRight) {
        if (toDecimal || !isEmpty(decPart)) {
            out.append(parser.decimalSeparator).append(decPart);
            appendEnd = !toDecimal;
        }
    } else {
        if (parser.decimalDigits > 0) {
            out.append(parser.decimalSeparator);
        }
        out.append(decPart);
    }

    if (appendEnd && oneFormatted.indexOf(")") >= 0) {
        out.append(")");
    }

    //Retrieve the caret
    var caret = getCaret(control);
    var oldNonDigitsToCaret = nonDigitsToCaret(control.value, caret), hadSymbol;
    var caretToEnd = toDecimal || caret == null || caret == control.value.length;
    if (caret != null && !isBlur) {
        hadSymbol = control.value.indexOf(parser.currencySymbol) >= 0 || control.value.indexOf(parser.decimalSeparator) >= 0;
    }

    //Update the value
    control.value = out.toString();

    if (caret != null && !isBlur) {
        //If a currency symbol was inserted, set caret to end
        if (!hadSymbol && ((value.indexOf(parser.currencySymbol) >= 0) || (value.indexOf(parser.decimalSeparator) >= 0))) {
            caretToEnd = true;
        }
        //Restore the caret
        if (!caretToEnd) {
            //Retrieve the new caret position
            var newNonDigitsToCaret = nonDigitsToCaret(control.value, caret);
            //There's no caret adjust when backspace was pressed
            if (isBackSpace) {
                caretAdjust = 0;
            }
            setCaret(control, caret + caretAdjust + newNonDigitsToCaret - oldNonDigitsToCaret);
        } else {
            setCaretToEnd(control);
        }
    }

    //Call the update function if present
    if (numberMask.updateFunction != null) {
        numberMask.updateFunction(numberMask);
    }

    return false;
}

//Function to check the text limit
function checkSizeLimit(control, isBlur) {
    var sizeLimit = control.sizeLimit;
    var max = sizeLimit.maxLength;
    var diff = max - control.value.length;
    if (control.value.length > max) {
        control.value = left(control.value, max);
        setCaretToEnd(control);
    }
    var size = control.value.length;
    var charsLeft = max - size;
    if (sizeLimit.output != null) {
        var text = sizeLimit.outputText;
        text = replaceAll(text, "${size}", size);
        text = replaceAll(text, "${left}", charsLeft);
        text = replaceAll(text, "${max}", max);
        setValue(sizeLimit.output, text);
    }
    if (isInstance(sizeLimit.updateFunction, Function)) {
        sizeLimit.updateFunction(control, size, max, charsLeft);
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
// MaskField Type Classes

/*
 * General input field type
 */
function MaskField() {
    this.literal = false;
    this.input = false;

    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return -1;
    }
}

/*
 * Literal field type
 */
function Literal(text) {
    this.base = MaskField;
    this.base();
    this.text = text;
    this.literal = true;

    //Return if the character is in the text
    this.isAccepted = function(chr) {
        return onlySpecified(chr, this.text);
    }

    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return text.indexOf(this.text, fromIndex);
    }
}

/*
 * User input field type
 */
function Input(accepted, min, max, padFunction, optional) {
    this.base = MaskField;
    this.base();
    this.accepted = accepted;
    if (min != null && max == null) {
        max = min;
    }
    this.min = min || 1;
    this.max = max || -1;
    this.padFunction = padFunction || null;
    this.input = true;
    this.upper = false;
    this.lower = false;
    this.capitalize = false;
    this.optional = booleanValue(optional);

    //Ensures the min/max consistencies
    if (this.min < 1) {
        this.min = 1;
    }
    if (this.max == 0) {
        this.max = -1;
    }
    if ((this.max < this.min) && (this.max >= 0)) {
        this.max = this.min;
    }

    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        text = text || "";
        fromIndex = fromIndex || 0;
        if (text.length < fromIndex) {
            return -1;
        }
        var toIndex = -1;
        for (var i = fromIndex; i < text.length; i++) {
            if (this.isAccepted(text.substring(fromIndex, i + 1))) {
                toIndex = i;
            } else {
                break;
            }
        }
        return toIndex;
    }

    //Tests whether this field accepts more than the given text
    this.acceptsMoreText = function(text) {
        if (this.max < 0) return true;
        return (text || "").length < this.max;
    }

    //Tests whether the text is accepted
    this.isAccepted = function(text) {
        return ((this.accepted == null) || onlySpecified(text, this.accepted)) && ((text.length <= this.max) || (this.max < 0));
    }

    //Tests whether the text length is ok
    this.checkLength = function(text) {
        return (text.length >= this.min) && ((this.max < 0) || (text.length <= this.max));
    }

    //Tests whether the text is complete
    this.isComplete = function(text) {
        text = String(text);
        if (isEmpty(text)) {
            return this.optional;
        }
        return text.length >= this.min;
    }

    //Apply the case transformations when necessary
    this.transformValue = function(text) {
        text = String(text);
        if (this.upper) {
            return text.toUpperCase();
        } else if (this.lower) {
            return text.toLowerCase();
        } else if (this.capitalize) {
            return capitalize(text);
        } else {
            return text;
        }
    }

    //Pads the text
    this.pad = function(text) {
        text = String(text);
        if ((text.length < this.min) && ((this.max >= 0) || (text.length <= this.max)) || this.max < 0) {
            var value;
            if (this.padFunction != null) {
                value = this.padFunction(text, this.min, this.max);
            } else {
                value = text;
            }
            //Enforces padding
            if (value.length < this.min) {
                var padChar = ' ';
                if (this.accepted == null || this.accepted.indexOf(' ') > 0) {
                    padChar = ' ';
                } else if (this.accepted.indexOf('0') > 0) {
                    padChar = '0';
                } else {
                    padChar = this.accepted.charAt(0);
                }
                return left(lpad(value, this.min, padChar), this.min);
            } else {
                //If has no max limit
                return value;
            }
        } else {
            return text;
        }
    }
}

/*
 * Lowercased input field type
 */
function Lower(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.lower = true;
}

/*
 * Uppercased input field type
 */
function Upper(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.upper = true;
}

/*
 * Capitalized input field type
 */
function Capitalize(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.capitalize = true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * The FieldBuilder class is used to build input fields
 */
function FieldBuilder() {

    /**
     * Builds a literal input with the given text
     */
    this.literal = function(text) {
        return new Literal(text);
    }

    /*
     * Build an input field with the given accepted chars.
     * All other parameters are optional
     */
    this.input = function(accepted, min, max, padFunction, optional) {
        return new Input(accepted, min, max, padFunction, optional);
    }

    /*
     * Build an uppercase input field with the given accepted chars.
     * All other parameters are optional
     */
    this.upper = function(accepted, min, max, padFunction, optional) {
        return new Upper(accepted, min, max, padFunction, optional);
    }

    /*
     * Build an lowercase field with the given accepted chars.
     * All other parameters are optional
     */
    this.lower = function(accepted, min, max, padFunction, optional) {
        return new Lower(accepted, min, max, padFunction, optional);
    }

    /*
     * Build an capitalized input field with the given accepted chars.
     * All other parameters are optional
     */
    this.capitalize = function(accepted, min, max, padFunction, optional) {
        return new Capitalize(accepted, min, max, padFunction, optional);
    }

    /*
     * Build an input field accepting any chars.
     * All parameters are optional
     */
    this.inputAll = function(min, max, padFunction, optional) {
        return this.input(null, min, max, padFunction, optional);
    }

    /*
     * Build an uppercase input field accepting any chars.
     * All parameters are optional
     */
    this.upperAll = function(min, max, padFunction, optional) {
        return this.upper(null, min, max, padFunction, optional);
    }

    /*
     * Build an lowercase field accepting any chars.
     * All parameters are optional
     */
    this.lowerAll = function(min, max, padFunction, optional) {
        return this.lower(null, min, max, padFunction, optional);
    }

    /*
     * Build an capitalized input field accepting any chars.
     * All parameters are optional
     */
    this.capitalizeAll = function(min, max, padFunction, optional) {
        return this.capitalize(null, min, max, padFunction, optional);
    }

    /*
     * Build an input field accepting only numbers.
     * All parameters are optional
     */
    this.inputNumbers = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_NUMBERS, min, max, padFunction, optional);
    }

    /*
     * Build an input field accepting only letters.
     * All parameters are optional
     */
    this.inputLetters = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /*
     * Build an uppercase input field accepting only letters.
     * All parameters are optional
     */
    this.upperLetters = function(min, max, padFunction, optional) {
        return this.upper(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /*
     * Build an lowercase input field accepting only letters.
     * All parameters are optional
     */
    this.lowerLetters = function(min, max, padFunction, optional) {
        return this.lower(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /*
     * Build an capitalized input field accepting only letters.
     * All parameters are optional
     */
    this.capitalizeLetters = function(min, max, padFunction, optional) {
        return this.capitalize(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }
}
//Create a FieldBuilder instance
var fieldBuilder = new FieldBuilder();

///////////////////////////////////////////////////////////////////////////////
/*
 * The MaskBuilder class is used to build masks in a easier to use way
 */
function MaskBuilder() {

    /*
     * Parses a String, building a mask from it.
     * The following characters are recognized
     * #, 0 or 9 - A number
     * a or A - A letter
     * ? or _ - Any character
     * l or L - A lowercase letter
     * u or U - An uppercase letter
     * c or C - A capitalized letter
     * \\ - A backslash
     * \#, \0, ... - Those literal characters
     * any other character - A literal text
     */
    this.parse = function(string) {
        if (string == null || !isInstance(string, String)) {
            return this.any();
        }
        var fields = new Array();
        var start = null;
        var lastType = null;
        //helper function
        var switchField = function(type, text) {
            switch (type) {
                case '_':
                    return fieldBuilder.inputAll(text.length);
                case '#':
                    return fieldBuilder.inputNumbers(text.length);
                case 'a':
                    return fieldBuilder.inputLetters(text.length);
                case 'l':
                    return fieldBuilder.lowerLetters(text.length);
                case 'u':
                    return fieldBuilder.upperLetters(text.length);
                case 'c':
                    return fieldBuilder.capitalizeLetters(text.length);
                default:
                    return fieldBuilder.literal(text);
            }
        }
        //Let's parse the string
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (start == null) {
                start = i;
            }
            var type;
            var literal = false;
            //Checks for the escaping backslash
            if (c == '\\') {
                if (i == string.length - 1) {
                    break;
                }
                string = left(string, i) + mid(string, i + 1);
                c = string.charAt(i);
                literal = true;
            }
            //determine the field type
            if (literal) {
                type = '?';
            } else {
                switch (c) {
                    case '?': case '_':
                        type = '_';
                        break;
                    case '#': case '0': case '9':
                        type = '#';
                        break;
                    case 'a': case 'A':
                        type = 'a';
                        break;
                    case 'l': case 'L':
                        type = 'l';
                        break;
                    case 'u': case 'U':
                        type = 'u';
                        break;
                    case 'c': case 'C':
                        type = 'c';
                        break;
                    default:
                        type = '?';
                }
            }
            if (lastType != type && lastType != null) {
                var text = string.substring(start, i);
                fields[fields.length] = switchField(lastType, text);
                start = i;
                lastType = type;
            } else {
                lastType = type
            }
        }
        //Use the last field
        if (start < string.length) {
            var text = string.substring(start);
            fields[fields.length] = switchField(lastType, text);
        }
        return fields;
    }

    /*
     * Build a mask that accepts the given characters
     * May also specify the max length
     */
    this.accept = function(accepted, max) {
        return [fieldBuilder.input(accepted, max)];
    }

    /*
     * Build a mask that accepts any characters
     * May also specify the max length
     */
    this.any = function(max) {
        return [fieldBuilder.any(max)];
    }

    /*
     * Build a numeric mask
     * May also specify the max length
     */
    this.numbers = function(max) {
        return [fieldBuilder.inputNumbers(max)];
    }

    /*
     * Build a decimal input mask
     */
    this.decimal = function() {
        var decimalField = fieldBuilder.inputNumbers();
        decimalField.optional = true;
        return [fieldBuilder.inputNumbers(), JST_FIELD_DECIMAL_SEPARATOR, decimalField];
    }

    /*
     * Build a mask that only accepts letters
     * May also specify the max length
     */
    this.letters = function(max) {
        return [fieldBuilder.inputLetters(max)];
    }

    /*
     * Build a mask that only accepts uppercase letters
     * May also specify the max length
     */
    this.upperLetters = function(max) {
        return [fieldBuilder.upperLetters(max)];
    }

    /*
     * Build a mask that only accepts lowercase letters
     * May also specify the max length
     */
    this.lowerLetters = function(max) {
        return [fieldBuilder.lowerLetters(max)];
    }

    /*
     * Build a mask that only accepts capitalized letters
     * May also specify the max length
     */
    this.capitalizeLetters = function(max) {
        return [fieldBuilder.capitalizeLetters(max)];
    }
}
//Create a MaskBuilder instance
var maskBuilder = new MaskBuilder();
