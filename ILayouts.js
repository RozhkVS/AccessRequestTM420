var icgLayout = function() {
    function icgLayout() {
        var _left = default_properties.positioning.left,
            _top = default_properties.positioning.top,
            _width = default_properties.positioning.width,
            _height = default_properties.positioning.height,
            _right = undefined,
            _bottom = undefined;
        this.id = 'layout'+icgLayout.count;
        this.name = 'Layout'+icgLayout.count++;
        this.control = 'ILayout';
        this.panels = [];
        this.index = window.layouts ? window.layouts.length : 0;
        window.layouts[this.index] = this;
        if(arguments){
            this.parent = arguments[0];
            default_properties.parent = this.parent;
        }
        this.elm = _elmCreate(this,default_properties);
        this.event = this.elm;
        this.css = this.elm.style;
        this.font = new iFont({control:this});
        this.children = [];
        this.frame = self;
        this.resizeble = true;
        this.obj = this.id;

        Object.defineProperty(this, 'left', {
            get: function() {
                return _left;
            },
            set: function(val) {
                _left= parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.left = _left + 'px';
            }
        });
        Object.defineProperty(this, 'top', {
            get: function() {
                return _top;
            },
            set: function(val) {
                _top = parseInt(val.toString().replace(/px+$/, ""));
                this.css.top = _top + 'px';
            }
        });
        Object.defineProperty(this, 'height', {
            get: function() {
                return _height;
            },
            set: function(val) {
                _height = parseInt(val.toString().replace(/px+$/, ""));
                this.css.height = _height + 'px';
            }
        });
        Object.defineProperty(this, 'width', {
            get: function() {
                return _width;
            },
            set: function(val) {
                _width = parseInt(val.toString().replace(/px+$/, ""));
                this.css.width = _width + 'px';
            }
        });
        Object.defineProperty(this, 'right', {
            get: function() {
                return _right;
            },
            set: function(val) {
                var rec = this.elm.getBoundingClientRect();
                _right = rec.left + rec.width;
                this.css.width = _right - rec.left + 'px';
            }
        });
        Object.defineProperty(this, 'bottom', {
            get: function() {
                return _bottom;
            },
            set: function(val) {
                var rec = this.elm.getBoundingClientRect();
                _bottom = rec.top + rec.height;
                this.css.height = _bottom - rec.top + 'px';
            }
        });
        // anchors.set('right',this.l + this.w);
        eval(this.obj + '=this');
        var rightAnchorValue = function(val){
            _right = val;
        }
        // anchors.right(true,rightAnchorValue);
        var bottomAnchorValue = function(val){
            _bottom = val;
        }
        this.rightFix=function(val){
            if(!anchors.right()){
                anchors.right(true,rightAnchorValue);
            }
            anchors.set('right',val);
        }
        this.bottomFix=function(val){
            if(!anchors.bottom()){
                anchors.bottom(true,bottomAnchorValue);
            }
            anchors.set('bottom',val);
        }
        this.preventSelection = new PreventSelection();
        this.render= new Function();
        this.event.onresize = new Function(this.obj + ".resize(); return false;");
        this.Rz = undefined;
    }
    icgLayout.prototype = {
        constructor: icgLayout,
        AddChild: function(icgControl) {
            this.children[this.children.length] = icgControl;
        },
        layoutInit: function(){
            // anchors.set('right',this.left + this.width);
            this.preventSelection.On(this.elm);
            this.Rz = resizilla(this.redraw, 10);
            if(arguments.length){
                if(arguments[0] == 'horizontal'){
                    this.panels[this.panels.length] = new icgControl({
                        parent: this.parent ?  this.parent : 'self',
                        left: 0,
                        top: 0,
                        height: this.parent ? this.parent.height : window.innerHeight,
                        width: this.parent ? Math.ceil(this.parent.width/2) :  Math.ceil(window.innerWidth / 2),
                        backgroundColor: 'inherit'
                    });
                    this.panels[this.panels.length] = new icgControl({
                        parent: this.parent ?  this.parent : 'self',
                        left: this.parent ? Math.ceil(this.parent.width / 2) : Math.ceil(window.innerWidth / 2),
                        top: 0,
                        height: this.parent ? this.parent.height : window.innerHeight,
                        width: this.parent ? Math.ceil(this.parent.width - this.parent.width / 2) : Math.ceil(window.innerWidth - window.innerWidth / 2),
                        backgroundColor: 'inherit'
                    });
                }
                if(arguments[0] == 'vertical'){
                    this.panels[this.panels.length] = new icgControl({
                        parent: this.parent ?  this.parent : 'self',
                        left: 0,
                        top: 0,
                        height: this.parent ? Math.ceil(this.parent.height/2) : Math.ceil(window.innerHeight / 2),
                        width: this.parent ? this.parent.width : window.innerWidth,
                        backgroundColor: 'inherit'
                    });
                    this.panels[this.panels.length] = new icgControl({
                        parent: this.parent ?  this.parent : 'self',
                        left: 0,
                        top: this.parent ? Math.ceil(this.parent.height/2) : Math.ceil(window.innerHeight / 2),
                        height: this.parent ? Math.ceil(this.parent.height - this.parent.height/2) : Math.ceil(window.innerHeight - window.innerHeight / 2),
                        width: this.parent ? this.parent.width : window.innerWidth,
                        backgroundColor: 'inherit'
                    });
                }
            }
        }
    }
    icgLayout.prototype.resize = function(){
        if(this.panels.length){
            var lWidth = this.panels[0].width,
                rWidth = this.panels[1].width,
                    lHeight = this.panels[0].height,
                rHeight = this.panels[1].height,
                childs_l = this.panels[0].children,
                childs_r = this.panels[1].children;
            childs_l.forEach(function(item){
                if(item.anchors.right && lWidth){
                    if(Object.getPrototypeOf(item) == icgMemo.prototype)
                        item.width = lWidth - item.left - 6;
                    else if(Object.getPrototypeOf(item) == icgListBox.prototype)
                        item.width = lWidth - item.left - 6;
                    else
                        item.width = lWidth - item.left - 8;
                }
                if(item.anchors.bottom && lHeight)
                    item.height = lHeight - item.top - 4;
            });
            childs_r.forEach(function(item){
                if(item.anchors.right && rWidth){
                    if(Object.getPrototypeOf(item) == icgMemo.prototype)
                        item.width = rWidth - item.left - 6;
                    else if(Object.getPrototypeOf(item) == icgListBox.prototype)
                        item.width = rWidth - item.left - 6;
                    else
                        item.width = rWidth - item.left - 8;
                }
                if(item.anchors.bottom && rHeight)
                    item.height = rHeight - item.top - 4;
            });
        }
    }
    icgLayout.prototype.redraw = function(obj){
        window.layouts.forEach(function(item){
            item.render();
        })
    }
    var _elmStyle = function(/*...*/) {
        var cssProps = arguments[0],pIndex,pValue = '';
        for(var prop in cssProps){
            pIndex = jsDomProp.split(';').indexOf(prop);
            if(pIndex>=0){
                var val = cssProps[prop];
                if(jsDomPxProp.split(';').indexOf(prop)>=0)
                    val = val + "px";
                pValue += htmlDomProp.split(';')[pIndex] + ':' + val + ';';
            }
        }
        return pValue;
    }
    var splitProp= function(prop){
        var res = {};
        for(var name in prop.visualization)
            res[name] = prop.visualization[name];
        for(name in prop.positioning)
            res[name] = prop.positioning[name];
        for(name in prop.layout)
            res[name] = prop.layout[name];
        return res;
    }
    var _elmCreate = function(/*...*/) {
        var obj = arguments[0],settings = arguments[1],
        div = document.createElement('div'),
        css = div.style;
        div.id = obj.id;
        css.cssText = _elmStyle(splitProp(settings));
        if (settings.border)
            css.border = settings.border + 'px solid ' + settings.borderColor;
        if (!settings.parent || (settings.parent == 'self')) {
            css.zIndex = settings.zIndex;
            if (document.body)
                document.body.appendChild(div);
        } else {
            if (settings.zIndex && (settings.parent.css.zIndex < settings.zIndex))
                css.zIndex = settings.zIndex
            else
                css.zIndex = settings.parent.css.zIndex + 1;
            document.getElementById(settings.parent.id).appendChild(div);
        }
        div.setAttribute('control', settings.control ? settings.control : obj.control);
        return div;
    };
    var default_properties = {
        visualization      :{
            display        : 'inherit',
            backgroundColor: '#F0F0F0',
            color          : '#000000'
        },
        positioning        :{
            position       : 'absolute',
            left           : 0,
            top            : 0,
            height         : window.innerHeight,
            width          : window.innerWidth
        },
        font               :{
            style          : 'normal',
            variant        : 'normal',
            weight         : 'normal',
            size           : 12,
            family         : 'Segoe UI',
            lineHeight     : 15
        },
        layout             :{
            overflowX      : 'hidden',
            overflowY      : 'hidden',
            borderSize     : 0
        },
        options            :{
            tooltip        : ""
        }
    };
    icgLayout.count = 0;
    return icgLayout;
}();