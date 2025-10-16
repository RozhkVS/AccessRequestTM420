// Mouse Event Functions
// mouse events for the Drag object and Scroll2 object
function fixEvent(e) {
    e.currentTarget = this;
    e.target = e.srcElement;

    if (e.type == 'mouseover' || e.type == 'mouseenter') e.relatedTarget = e.fromElement;
    if (e.type == 'mouseout' || e.type == 'mouseleave') e.relatedTarget = e.toElement;

    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;

        e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
        e.pageX -= html.clientLeft || 0;

        e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
        e.pageY -= html.clientTop || 0;
    }

    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
    }

    return e;
}

function initMouseEvents() {
    document.onmousedown = mouseDown;
    document.onmousemove = mouseMove;
    document.onmouseup = mouseUp;
}

function mouseDown(e) {
    fixEvent.call(this, window.event);
    if (is.ie && event.button != 1) return true;
    var x = event.x + document.body.scrollLeft;
    var y = event.y + document.body.scrollTop;
    if (Scroll && ScrollTestActive()) return false;
    else if (Drag && drag.mouseDown(x, y)) return false;
    else return DynMouseDown(x, y);
}

function mouseMove(e) {
    fixEvent.call(this, window.event);
    var x = event.x + document.body.scrollLeft;
    var y = event.y + document.body.scrollTop;
    if (Scroll && ScrollTestActive()) return false;
    else if (Drag && drag.mouseMove(x, y)) return false;
    else return DynMouseMove(x, y);
}

function mouseUp(e) {
    fixEvent.call(this, window.event);
    var x = event.x + document.body.scrollLeft;
    var y = event.y + document.body.scrollTop;
    if (Drag && drag.mouseUp(x, y)) return false;
    else return DynMouseUp(x, y);
}

// overwrite these functions in your html source to do other mouse handling
function DynMouseDown(x, y) { return true; }

function DynMouseMove(x, y) { return true; }

function DynMouseUp(x, y) { return true; }

// include drag.js and/or scroll2.js after this file to overwrite these variables
Drag = null;
Scroll = null;