(function(global) {
    var traceBuffer = [];
    var tracePrettyBuffer = [];
    document.onDebug = false;
    document.DebugForm = undefined;
    document.startDebug = function() {
        openDebug();
    }
    document.trace = function(traceLog) {
        traceBuffer.push(traceLog);
        // if(document.DebugForm)
        //     openDebug();
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
            if (!isEmpty(objectSeparator))
                out += objectSeparator + separator
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
                var traceLog = traceBuffer.join('\n');
                output.value = output.value ? output.value + "\n" + traceLog : traceLog  + '\n';
                traceBuffer = [];
            }
            if (tracePrettyBuffer.length) {
                for(var i = 0;  i < tracePrettyBuffer.length; i++)
                    win.document.getElementById("print").appendChild(tracePrettyBuffer[i]);
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
        global.output = output;
        global.onbeforeunload = beforeClose;
    }
})(window);