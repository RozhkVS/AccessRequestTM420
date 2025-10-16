var ILIB = ILIB || {};
(function(win, ILIB){
    var global = win;
    var doc = global.document;
    //Private variables
    var _moduleStore = {};
    var _todos = [];
    var scripts;
    var bodies;

    var dragging = null;
    var startDate = new Date();
        diffX = 0,
        diffY = 0;

    if(!global.librerypath)
        global.librerypath = getLibreryPath("ILIB.js");

    if (typeof ILIB.namespace !== "function") {
        ILIB.namespace = function (ns_string) {
            var parts = ns_string.split("."),
                parent = ILIB;
            // отбросить начальный префикс – имя глобального объекта
            if (parts[0] === "ILIB") {
                parts = parts.slice(1);
            }
            for (var i = 0, c = parts.length; i < c; i += 1) {
                // создать свойство, если оно отсутствует
                if (typeof parent[parts[i]] === "undefined") {
                    parent[parts[i]] = {};
                }
                parent = parent[parts[i]];
            }
            return parent;
        };
    }

    /*-------------------------------------*/
    //Private definition
    function getLibreryPath(js) {
        var sources = document.getElementsByTagName("script");
        var path = "";
        for (var i = 0, l = sources.length; i < l; i++) {
            var src = sources[i].src;
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
    }//
    var _extend = function(out) {
        var i, key;
        out = out || {};
        for (i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            var obj = arguments[i];
            for (key in obj) {
                if (typeof obj[key] === 'object')
                    out[key] = _extend(obj[key], out[key]);
                else
                    out[key] = obj[key];
            }
        }
        return out;
    };
    function extend(subClass, superClass) {
      var F = function() {};
      F.prototype = superClass.prototype;
      subClass.prototype = new F();
      subClass.prototype.constructor = subClass;
    }
    function inherit(C, P) {
        var F = function () {};
        F.prototype = P.prototype;
        C.prototype = new F();
        C.uber = P.prototype;
        C.prototype.constructor = C;
    }
    function _modulePath(mp_string){
        var parts = mp_string.split("/");
        if(parts.length)
            parts.pop();
        return parts.join('/');
    }
    function _moduleFile(mp_string){
        return mp_string.split("/").slice(-1);
    }
    function getXMLHTTPRequest() {
        var req = null;
        try { req = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {
            try { req = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {
                try { req = new XMLHttpRequest(); } catch(e) {}
            }
        }
        if (req == null) throw new Error("XMLHttpRequest not supported");
        return req;
    }
    function require(file,callback){
        var script = document.getElementsByTagName('script')[0],
            newjs = document.createElement('script');
        newjs.onreadystatechange = function(){
            if(newjs.readyState === 'loaded' || newjs.readyState === 'complete' ){
                newjs.onreadystatechange = null;
                callback();
            }
        }
        newjs.src = file;
        script.parentNode.insertBefore(newjs,script);

    }
    function fetch(url,callback){
        var req = getXMLHTTPRequest();
        req.open("GET",url);
        // req.setRequestHeader("User-Agent",navigator.userAgent);
        // req.setRequestHeader("Accept","text/javascript");
        req.onreadystatechange = function(){
            if (req.readyState == 4)
                callback(req.responseText);
        };
       req.send();
    }
    function insertScript(url,callback){
        var script = document.createElement("script"),
        fn = (callback) ? callback : new Function('return true;');
        script.type = "text/javascript";
        script.setAttribute('data-module-name', _moduleFile(url));
        script.addEventListener("load", function(){
            setTimeout(fn, 0);
        });
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    function include(moduleNames){
        bodies = [];//new Array(moduleNames.length);
        moduleNames.forEach(function(script,index){
            var src = script;
            insertScript(script);
        });
    }
    function insertScript2(scriptBody){
        var textNode = document.createTextNode(scriptBody);
        var script = document.createElement('script');
        script.appendChild(textNode);
        // document.body.appendChild(script);
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    function include2(moduleNames){
        bodies = [];//new Array(moduleNames.length);
        moduleNames.forEach(function(script,index){
            var src = global.librerypath + script;
            fetch(src,function(body){
                bodies[index]=body;
                if(bodies.length == moduleNames.length){
                    bodies.forEach(insertScript2);
                }
            });
        })
    }
    function handleEvent(event){
        //get event and target
        event = iEvents.getEvent(event);
        var target = iEvents.getTarget(event);
        //determine the type of event
        switch(event.type){
            case "mousedown":
                if (target.className.indexOf("draggable") > -1){
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                }
                break;
            case "mousemove":
                if (dragging !== null){
                    dragging.style.left = (event.clientX - diffX) + "px";
                    dragging.style.top = (event.clientY - diffY) + "px";
                }
                break;
            case "mouseup":
                dragging = null;
                break;
        }
    };
    function extendDeep(parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";
        child = child || {};
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === 'object') {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    extendDeep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        return child;
    };
    function assign(obj, prop, value) {
        if (typeof prop === 'string')
            prop = prop.split('.');
        if (prop.length > 1) {
            var e = prop.shift();
            assign(obj[e] = Object.prototype.toString.call(obj[e]) === '[object Object]'
                ? obj[e]
                : {}, prop, value);
        } else
            obj[prop[0]] = value;
    }
    function styleHyphenFormat(propertyName) {
      function upperToHyphenLower(match) {
        return "-" + match.toLowerCase();
      }
      return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
    }
    //expose some functions to global scope
    global.include = include;
    global.require = require;
    global.assign = assign;//var obj = {}, propName = 'foo.bar.foobar'; assign(obj, propName, 'Value');
    // global.define = define;
    global._extend = _extend;
    global.extend = extend;
    global.inherit = inherit;
    global.extendDeep = extendDeep;
    global.styleHyphenFormat = styleHyphenFormat;
    global.get = 'getElementById'
    /*-------------------------------------*/
global.include([
    'core/iLib.core.js',
    'defaults.js',
    'lib/alasql.min.js',
    'JSTools/JavaScriptUtil.js',
    // 'JSTools/Parsers.js',
    // 'JSTools/InputMask.js',
    'iFont.js',
    'core/event.resize.js',
    'icgControls.js',
    'icgDebug.js',
    'api/EventTarget.js',
    'ITree.js',
    'iTreeGrid.js',
    'iPopupMenu.js',
    'ISearchField.js',
    'ISearchPanel.js',
    'IMainMenu.js'
]);
    /*-------------------------------------*/
    var iDom = function(params,context){
        return new GetOrMakeDom(params,context);
    };
    var GetOrMakeDom = function(params,context){
        var currentContext = doc;
        if(context){
            if(context.nodeType){//its either a document node or element node
                currentContext = context;
            }else{//else its a string selector, use it to selector a node
                currentContext = doc.querySelector(context);
            }
        }
        //if no params, return empty dom() object
        if(!params || params === '' || typeof params === 'string' && params.trim() === ''){
            this.length = 0;
            return this;
        }
        //if HTML string, construct domfragment, fill object, then return object
        if(typeof params === 'string' && /^\s*<(\w+|!)[^>]*>/.test(params)){//yup its forsure html string
            //create div & docfrag, append div to docfrag, then set its div's innerHTML to the string, then get first child
            var divElm = currentContext.createElement('div');
            divElm.className = 'doc-frag-wrapper';
            var docFrag = currentContext.createDocumentFragment();
            docFrag.appendChild(divElm);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.innerHTML = params;
            var numberOfChildren = queryDiv.children.length;
            //loop over nodelist and fill object, needs to be done because a string of html can be passed with siblings
            for (var z = 0; z < numberOfChildren; z++) {
                this[z] = queryDiv.children[z];
            }
            //give the object a length value
            this.length = numberOfChildren;
            //return object
            return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}
        }
        //if a single node reference is passed, fill object, return object
        if(typeof params === 'object' && params.nodeName){
            this.length = 1;
            this[0] = params;
            return this;
        }
        //if its an object but not a node assume nodelist or array, else its a string selector, so create nodelist
        var nodes;
        if(typeof params !== 'string'){//nodelist or array
            nodes = params;
        }else{ //ok string
            nodes = currentContext.querySelectorAll(params.trim());
        }
        //loop over array or nodelist created above and fill object
        var nodeLength = nodes.length;
        for (var i = 0; i < nodeLength; i++) {
            this[i] = nodes[i];
        }
        //give the object a length value
        this.length = nodeLength;
        //return  object
        return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}
    };
    GetOrMakeDom.prototype = {
        each: function (callback) {
            var len = this.length;
            for(var i = 0; i < len; i++){
                callback.call(this[i], i, this[i]);
            }
            return this;
        },
        html: function(htmlStringOrTextString){
            if(htmlStringOrTextString){
                return this.each(function(){
                    this.innerHTML = htmlStringOrTextString;
                });
            }else{
                return this[0].innerHTML;
            }
        },
        text: function(textString){
            if(textString){
                return this.each(function(){
                    this.textContent = textString;
                });
            }else{
                return this[0].textContent.trim();
            }
        },
        append: function(stringOrObject){
            return this.each(function(){
                if(typeof stringOrObject === 'string'){
                    this.insertAdjacentHTML('beforeend',stringOrObject);
                }else{
                    var that = this;
                    iDom(stringOrObject).each(function(name,value){
                        that.insertAdjacentHTML('beforeend',value.outerHTML);
                    });
                }
            });
        }
    }
    global.iDom = iDom;//expose iDom to global scope
    /*-------------------------------------*/

    /*-------------------------------------*/
    var iEvents = {
        addHandler: function(element, type, handler){
            if (element.addEventListener){
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent){
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        getButton: function(event){
            if (document.implementation.hasFeature("MouseEvents", "2.0")){
                return event.button;
            } else {
                switch(event.button){
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4: return 1;
                }
            }
        },
        getCharCode: function(event){
            if (typeof event.charCode == "number"){
                return event.charCode;
            } else {
                return event.keyCode;
            }
        },
        getClipboardText: function(event){
            var clipboardData =  (event.clipboardData || window.clipboardData);
            return clipboardData.getData("text");
        },
        getEvent: function(event){
            return event ? event : window.event;
        },
        getRelatedTarget: function(event){
            if (event.relatedTarget){
                return event.relatedTarget;
            } else if (event.toElement){
                return event.toElement;
            } else if (event.fromElement){
                return event.fromElement;
            } else {
                return null;
            }
        },
        getTarget: function(event){
            return event.target || event.srcElement;
        },
        getWheelDelta: function(event){
            if (event.wheelDelta){
                return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
            } else {
                return -event.detail * 40;
            }
        },
        preventDefault: function(event){
            if (event.preventDefault){
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        removeHandler: function(element, type, handler){
            if (element.removeEventListener){
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent){
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },
        setClipboardText: function(event, value){
            if (event.clipboardData){
                event.clipboardData.setData("text/plain", value);
            } else if (window.clipboardData){
                window.clipboardData.setData("text", value);
            }
        },
        stopPropagation: function(event){
            if (event.stopPropagation){
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    };
    global.iEvents = iEvents;
    // iEvents.addHandler(global,"DOMContentLoaded",configDoc);
    // iEvents.addHandler(global, "load", configDoc);
    /*-------------------------------------*/

    /*-------------------------------------*/
    var iDragDrop ={
        //public interface
            enable: function(){
                iEvents.addHandler(document, "mousedown", handleEvent);
                iEvents.addHandler(document, "mousemove", handleEvent);
                iEvents.addHandler(document, "mouseup", handleEvent);
            },
            disable: function(){
                iEvents.removeHandler(document, "mousedown", handleEvent);
                iEvents.removeHandler(document, "mousemove", handleEvent);
                iEvents.removeHandler(document, "mouseup", handleEvent);
            }
    };
    global.iDragDrop = iDragDrop;
    /*-------------------------------------*/

    var iObserver = {
        addSubscriber:function (callback) {
            this.subscribers[this.subscribers.length] = callback;
        },
        removeSubscriber:function (callback) {
            for (var i = 0; i < this.subscribers.length; i++) {
                if (this.subscribers[i] === callback) {
                   delete(this.subscribers[i]);
                }
            }
        },
        publish:function (what) {
            for (var i = 0; i < this.subscribers.length; i++) {
                if (typeof this.subscribers[i] === 'function') {
                    this.subscribers[i](what);
                }
            }
        },
        make:function (o) { // turns an object into a publisher
            for (var i in this) {
                o[i] = this[i];
                o.subscribers = [];
            }
        }
    };
    global.iObserver = iObserver;
    global.iDoc = doc;
    global.iView = doc;
    global.layouts = [];
    global.libStartDate = startDate;
})(window, ILIB);
bootPATH = librerypath;