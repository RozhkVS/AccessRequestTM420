var icgControl = function() {
    var docCSSStyle;
    function icgControl(settings) {
        var _this = this,
            _x = 0,//left
            _y = 0,//top
            _h = 0,//height
            _w = 0,//width
            _visible =false,
            _initialization = true,
            _font,
            _draggable,
            _observation;
        if(docCSSStyle == undefined) docCSSStyle = document.body.style;
        var options = _extend({}, defaults, settings);
        this.id = options.id || 'iControl' + (icgControl.count);
        this.name = options.name || 'Control' + (icgControl.count++);
        this.control = options.control || 'BaseControl';
        this.elm = this.event = _elmCreate(this,options);
        this.dispath = function(event){//эта функция вызывается "ИЗДАТЕЛЕМ"
            var methodName = 'on' + event.type;
            //функция methodName должна быть определена в объекте-подписчике
            if(typeof _this[methodName] !== 'undefined'){
                _this[methodName](event);
            }
        }
        if(options.parent && (options.parent != 'self')){
            // console.log(options.parent.id + ' : ' + this.id);
            options.parent.AddChild(this);
            this.parent = options.parent;
            if(!options.deferred)
                this.parent.elm.appendChild(this.elm);
        }
        this.css = this.elm.style;
        this.isDrag = false;
        // if(options.observation){
        //     iObserver.make(this);
        //     _observation = true;
        //     console.log("I'm " + this.name + ', and I became an observer');
        // }
        // else _observation = false;
        Object.defineProperty(this, 'observation', {
            get: function() {
                return _observation;
            },
            set: function(val) {
                _observation = val;
                this.observer = iObserver;
                this.observer.make(this);
                // console.log("I'm " + this.name + ', and I became an observer');
            }
        });
        Object.defineProperty(this, 'visible', {
            get: function() {
                return _visible;
            },
            set: function(val) {
                _visible = val;
                if(val)
                    this.css.display = 'inherit'
                else
                    this.css.display = 'none';
            },
            configurable: true,
        });
        /*хранение метрик элемента в "чистом", числовом виде (не в виде строки - "Npx")*/
        _x = options.left;
        Object.defineProperty(this, 'x', {
            get: function() {
                return _x;
            },
            set: function(val) {
                _x = parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.left = _x + 'px';
            }
        });
        _y = options.top;
        Object.defineProperty(this, 'y', {
            get: function() {
                return _y;
            },
            set: function(val) {
                _y = parseInt(val.toString().replace(/px+$/, ""));
                this.css.top = _y + 'px';
            }
        });
        _h = options.height;
        Object.defineProperty(this, 'h', {
            get: function() {
                return _h;
            },
            set: function(val) {
                _h = parseInt(val.toString().replace(/px+$/, ""));
                this.css.height = _h + 'px';
            }
        });
        _w = options.width;
        Object.defineProperty(this, 'w', {
            get: function() {
                return _w;
            },
            set: function(val) {
                _w = parseInt(val.toString().replace(/px+$/, ""));
                this.css.width = _w + 'px';
            }
        });
        /*
          актуальные координаты отступа курсора от верхнего левого угла
          в приделах iControl для вывода tooltip или popupmenu
        */
        this.posXoff = 0;
        this.posYoff = 0;
        //
        _font = new iFont({control: this});
        this.font = _font;
        this.autoresize = false;//TO DO: Заменить имя свойства на flat
        this.anchors = {};
        this.anchors.top = true;
        this.anchors.right = false;
        this.anchors.bottom = false;
        this.anchors.left = true;
        this.constraints = {};
        this.constraints.maxHeight = 0;
        this.constraints.maxWidth = 0;
        this.constraints.minHeight = 0;
        this.constraints.minWidth = 0;
        this.leftIndent = options.left;
        this.rightIndent = 0;
        this.resizeble = false;
        //
        this.children = [];

        this.elm.obj = this;
        this.obj = this.id;
        eval(this.obj + '=this');
    }
    icgControl.prototype = {
        constructor: icgControl,
        get left() {
             return this.x;
        },
        set left(val) {
            this.x = parseInt(val.toString().replace(/px+$/, ""));
            this.css.left = this.x + 'px';
            this.changePosition();
            if(this.observation && this.children.length){
                this.publish({type:'ParentResize',observer: this});
            }
        },
        get top() {
            return this.y;
        },
        set top(val) {
            this.y = parseInt(val.toString().replace(/px+$/, ""));
            this.css.top = this.y + 'px';
            this.changePosition();
            if(this.observation && this.children.length){
                this.publish({type:'ParentResize',observer: this});
            }
        },
        get height() {
            return this.h;
        },
        set height(val) {
            this.h = parseInt(val.toString().replace(/px+$/, ""));
            this.css.height = this.h + 'px';
            this.changeSize();
            if(this.observation && this.children.length)
                this.publish({type:'ParentResize',observer: this});
        },
        get width() {
            return this.w;
        },
        set width(val) {
            this.w = parseInt(val.toString().replace(/px+$/, ""));
            this.css.width = this.w + 'px';
            this.changeSize();
            if(this.observation && this.children.length)
                this.publish({type:'ParentResize',observer: this});
        },
        get indentRight() {
                return this.rightIndent;
        },
        set indentRight(val) {
            this.rightIndent = val;
            if(this.parent && (this.parent !== 'self')){
                if(this instanceof icgControl)
                    if(this.anchors.right)
                        this.w = this.parent.w - (this.x + this.horizontalBorderW() || 0) - this.rightIndent;
            }
        },
        get indentLeft() {
                return this.leftIndent;
        },
        set indentLeft(val) {
            this.leftIndent = val;
            if(this.parent && (this.parent !== 'self')){
                if(this instanceof icgControl)
                    if(this.anchors.right)
                        this.w = this.parent.w - (this.x + this.horizontalBorderW() || 0) - this.leftIndent;
            }
        },
        set color(val) {
            this.css.color = val;
        },
        get color() {
            return this.elm ? this.css.color : undefined;
        },
        // set visible(val) {
        //     if(val)
        //         this.css.display = 'inherit'
        //     else
        //         this.css.display = 'none';
        // },
        // get visible() {
        //     if(!this.elm) return false;
        //     if(this.css.display == 'none')
        //         return false;
        //     else
        //         return true;
        // },
        get owner(){
            return this.parent ? this.parent : null;
        },
        set owner(val){
            if(!val)
                return;
            if(val instanceof icgControl){
                this.parent = val;
                this.parent.AddChild(this);
            }
        },
        get draggable(){
            return this.isDrag;
        },
        set draggable(val){
            if(val)
                this.elm.classList.add('draggable')
            else
                this.elm.classList.remove('draggable');
            this.isDrag = val;
        },
        getStyleProp: function(prop){
            var c = this.elm,
                style = c.style;
            if(style[prop])
                return parseInt(style[prop].toString().replace(/px+$/, ""));
        },
        contentHeight: function() {
            return parseInt(this.css.lineHeight);
        },
        contentWidth: function(content) {
            var metrics,
                canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            context.font = this.font.toString();
            metrics = context.measureText(content);
            return Math.ceil(metrics.width);
        },
        AddChild: function(o) {
            this.children[this.children.length] = o;
            if(this.observation){
                this.addSubscriber(o.dispath);
                // console.log("I'm " + this.name + ' add subscriber ' + o.control);
            }
        },
        setBgColor: function(c) {
            this.css.backgroundColor = c;
        },
        getBgColor: function() {
            return this.css.backgroundColor;
        },
        setHTML: function(html) {
            this.elm.innerHTML = html;
        },
        setOverflow: function(overflow) {
            if (overflow)
                this.css.overflow = 'auto';
            else
                this.css.overflow = 'hidden';
        },
        moveTo: function(x, y) {
            this.left = x;
            this.top = y;
        },
        moveBy: function(x, y) {
            this.moveTo(this.left + x, this.top + y);
        },
        resizeTo: function(w,h){
                this.width = w;
                this.height = h;
        },
        resizeBy: function(w,h){
            this.resizeTo(this.width + w,this.height + h);
        },
        clientWidth: function(){
            var hPadding = (this.getStyleProp("paddingLeft") || 0 + this.getStyleProp("paddingRight") || 0);
            return this.elm.getBoundingClientRect().width - (hPadding + this.horizontalBorderW());
        },
        offsetLeft: function(){
            return (this.getStyleProp("paddingLeft") + this.getStyleProp("borderLeft"));
        },
        offsetRight: function(){
            return (this.getStyleProp("paddingRight") + this.getStyleProp("borderRight"))
        },
        horizontalBorderW: function(){
            return (this.getStyleProp("borderLeft") + this.getStyleProp("borderRight"));
        },
        show: function() {
            this.css.visibility = 'visible';
            this.elm.classList.remove('visuallyhidden');
            return this;
            //this.css.display = 'inline';
        },
        hide: function() {
            this.css.visibility = 'hidden';
            this.elm.classList.add('visuallyhidden');
            return this;
            // this.css.display = 'none';
        }
    };
    icgControl.prototype.onFontChange = new Function();
    icgControl.prototype.changePosition = new Function();
    icgControl.prototype.changeSize = new Function();
    icgControl.prototype.onDispath = new Function();
    icgControl.prototype.leave = onMouseLeave;
    icgControl.prototype.move = onMouseMove;
    //
    function onMouseMove(e){

        return true;
    }
    function onMouseLeave(e){

        return true;
    }
    var _elmStyle = function(/*...*/) {
        //Для любого iControl установливаю значения всех (defaults + параметры при вызове)
        //DOM-свойств, а выделенным в КОНСТАНТЕ jsDomPxProp (модуль defaults.js) добавляю
        //к значению параметра "px"
        var cssProps = arguments[0],
            pValue = '',
            prop,
            val;
        for(prop in cssProps){
            if(typeof docCSSStyle[prop] !== "undefined"){
                val = cssProps[prop];
                if(typeof val === 'number'){
                    if(jsDomPxProp.split(';').indexOf(prop)>=0)
                        val = val + "px";
                }
                pValue += styleHyphenFormat(prop) + ': ' + val + ';';
            }
        }
        return pValue;
    };
    var _elmCreate = function(/*...*/) {
        var obj = arguments[0],settings = arguments[1],
            div = document.createElement('div'),
            css = div.style;
        div.id = obj.id;
        div.setAttribute('control', settings.control ? settings.control : obj.control);
        css.cssText = _elmStyle(settings);
        if (!settings.parent || (settings.parent == 'self')) {
            css.zIndex = settings.zIndex;
            document.body.appendChild(div);
        } else {
            if (settings.zIndex && (settings.parent.css.zIndex < settings.zIndex))
                css.zIndex = settings.zIndex;
            else{
                // css.zIndex = settings.parent.css.zIndex + 1;
                // console.log(settings.parent);
                css.zIndex = settings.parent.css ? settings.parent.css.zIndex : settings.parent.style.zIndex;
                css.zIndex = css.zIndex + 1;
            }
        }
        return div;
    };
    icgControl.count = 0;
    var defaults = {
        position       : 'absolute',
        display        : 'inherit',
        // fontFamily     : 'Segoe UI',
        // fontSize       : 12,
        // fontItalic     : false,
        // fontBold       : false,
        // lineHeight     : 15,
        backgroundColor: '#F0F0F0',
        left           : 0,
        top            : 0,
        height         : 1,
        width          : 1,
        color          : '#000000',
        overflowX      : 'hidden',
        overflowY      : 'hidden',
        cursor         : 'default'
    };
    return icgControl;
}();

var icgBorderManager = function() {
    var icgBorderManager = function(owner) {
        if (!owner || !owner.elm) {
            alert('Error. Parent object not defined!')
            return null;
        }
        /*базовые свойства*/
        this.name = owner.name + 'iBorderManager';
        this.owner = owner;
        // this.obj = this.name + 'Object';
        /*свойства по умолчанию*/
        var
            _size = 0,
            _color = '#7F7F7F',
            _style = 'solid',//'dotted','dashed','solid','double','groove','ridge','inset','outset'
            _disabledColor = 'transparent';
        /**/
        this.owner.css.borderWidth = _size;
        this.owner.css.borderColor = _color;
        this.owner.css.borderStyle = _style;
        /**/
        var sides = {};
        Object.defineProperty(this, 'style', {
            get: function() {
                return _style
            },
            set: function(val) {
                _style = val;
                this.onChange({owner:this.owner,prop: 'style',value: val});
            }
        });
        Object.defineProperty(this, 'color', {
            get: function() {
                return _color
            },
            set: function(val) {
                _color = val;
                this.onChange({owner:this.owner,prop: 'color',value: val});
            }
        });
        Object.defineProperty(this, 'size', {
            get: function() {
                return _size
            },
            set: function(val) {
                _size = val;
                this.onChange({owner:this.owner,prop:'size',value:val});
            }
        });
        Object.defineProperty(this, 'top', {
            get: function() {
                return sides.top
            },
            set: function(val) {
                sides.top = val;
                if (val){
                    this.owner.css.borderTopColor = _color;
                    this.owner.css.borderTopStyle = _style;
                    this.owner.css.borderTopWidth = _size + 'px';
                }
                else{
                    this.owner.css.borderTopColor = _disabledColor;
                    this.owner.css.borderTopStyle = _style;
                    this.owner.css.borderTopWidth = '0px';
                }
            }
        });
        Object.defineProperty(this, 'right', {
            get: function() {
                return sides.right
            },
            set: function(val) {
                sides.right = val;
                if (val){
                    this.owner.css.borderRightColor = _color;
                    this.owner.css.borderRightStyle = _style;
                    this.owner.css.borderRightWidth = _size + 'px';
                }
                else{
                    this.owner.css.borderRightColor = _disabledColor;
                    this.owner.css.borderRightStyle = _style;
                    this.owner.css.borderRightWidth = '0px';
                }
            }
        });
        Object.defineProperty(this, 'bottom', {
            get: function() {
                return sides.bottom
            },
            set: function(val) {
                sides.bottom = val;
                if (val){
                    this.owner.css.borderBottomColor = _color;
                    this.owner.css.borderBottomStyle = _style;
                    this.owner.css.borderBottomWidth = _size + 'px';
                }
                else{
                    this.owner.css.borderBottomColor = _disabledColor;
                    this.owner.css.borderBottomStyle = _style;
                    this.owner.css.borderBottomWidth = '0px';
                }
            }
        });
        Object.defineProperty(this, 'left', {
            get: function() {
                return sides.left
            },
            set: function(val) {
                sides.left = val;
                if (val){
                    this.owner.css.borderLeftColor = _color;
                    this.owner.css.borderLeftStyle = _style;
                    this.owner.css.borderLeftWidth = _size + 'px';
                }
                else{
                    this.owner.css.borderLeftColor = _disabledColor;
                    this.owner.css.borderLeftStyle = _style;
                    this.owner.css.borderLeftWidth = '0px';
                }
            }
        });
        this.Init();
        // eval(this.obj + '=this')
    };
    icgBorderManager.prototype = Object.create(icgBorderManager.prototype);
    icgBorderManager.prototype.constructor = icgBorderManager;
    icgBorderManager.prototype.Init = function() {
        this.top = false;
        this.right = false;
        this.bottom = false;
        this.left = false;
        this.size = 0;
    }
    icgBorderManager.prototype.onChange = function(event) {
        if(event.prop == 'size'){
            event.owner.css.borderLeftWidth  = event.value + 'px';
            event.owner.css.borderTopWidth  = event.value + 'px';
            event.owner.css.borderRightWidth  = event.value + 'px';
            event.owner.css.borderBottomWidth  = event.value + 'px';
        }
        if(event.prop == 'color'){
            event.owner.css.borderColor = event.value;
        }
        if(event.prop == 'style'){
            event.owner.css.borderStyle = event.value;
        }
    }
    return icgBorderManager;
}();

var icgLabel = function() {
    function icgLabel(settings) {
        var _caption,
            _wrap,
            _autosize,
            _align,
            _valign,
            _indent,
            options = _extend({}, defaults, settings);
        options.id = options.id || 'iLabel_' + icgLabel.count;
        options.control = options.control || 'Label';
        icgControl.call(this, options);
        this.name = 'Label' + (icgLabel.count++);
        _caption = options.caption;
        Object.defineProperty(this, 'caption', {
            get: function() {
                return _caption;
            },
            set: function(val) {
                _caption = val;
                this.labelCaption.innerText = val;
                this.autosize = this.autosize;
            }
        });
        _wrap = options.wrap;
        Object.defineProperty(this, 'wrap', {
            get: function() {
                return _wrap;
            },
            set: function(val) {
                _wrap = val;
                this.setWrap();
                this.autosize = this.autosize;
            }
        });
        _autosize = options.autosize;
        Object.defineProperty(this, 'autosize', {
            get: function() {
                return _autosize;
            },
            set: function(val) {
                _autosize = val;
                if (val) {
                    var curWidth = this.getContentWidth();
                    this.width = curWidth;
                    var curHeight = this.getContentHeight();
                    this.height = curHeight;
                }
            }
        });
        _align = options.align;
        Object.defineProperty(this, 'align', {
            get: function() {
                return this._align;
            },
            set: function(val) {
                this._align = val;
                this.labelCaption.parentNode.align = val;
            }
        });
        _valign = options.valign;
        Object.defineProperty(this, 'valign', {
            get: function() {
                return this._valign;
            },
            set: function(val) {
                this._valign = val;
                this.labelCaption.parentNode.style.verticalAlign = (val == 'center') ? '' : val;
            }
        });
        this.selectable = false;
        _indent = options.indent;
        Object.defineProperty(this, 'indent', {
            get: function() {
                return _indent;
            },
            set: function(val) {
                _indent = val;
                this.labelCaption.style.paddingLeft = val + 'px';
                this.autosize = this.autosize;
            }
        });
        this.Build();
        this.onFontChange = FontChange;
        this.resize = onResize;
        this.autosize = this.autosize;
        if(this.height < this.font.size)
            this.height = this.contentHeight();
        this.css.cursor = 'default';
    }
    icgLabel.prototype = Object.create(icgControl.prototype);
    icgLabel.prototype.constructor = icgLabel;
    icgLabel.prototype.Build = function() {
        var text = this.caption ? this.caption : this.name,
            css = 'padding-left:' + this.indent + 'px;',
            styled = '<div style=\'' + css + '\'>' + text + '</div>',
            cellStyle = ' style=\'background-color:inherit;vertical-align:' + this._valign + '\'',
            tCell = '<tr><td align=\'' + this._align + '\' ' + (this._wrap ? '' : 'nowrap') + cellStyle + '>' + styled + '</td></tr>',
            textFull = '<table width=' + this.width + 'px cellpadding=0 cellspacing=0 border=0>' + tCell + '</table>';
        this.setHTML(textFull);
        this.labelBox = this.elm.querySelector('TABLE');
        this.labelCaption = this.labelBox.querySelector('DIV');
        this.labelCaption.setAttribute('id',this.name);
        this.event.onresize = new Function(this.obj + '.resize(); return false;');
        return this;
    };
    icgLabel.prototype.setWrap = function() {
        if (this.wrap)
            this.labelCaption.parentNode.removeAttribute('nowrap');
        else
            this.labelCaption.parentNode.setAttribute('nowrap', '');
    };
    icgLabel.prototype.getContentHeight = function() {
        var strHeight = this.contentHeight();
        return (this.wrap ? strHeight * getContentWordsCount(this.caption) : strHeight);
    };
    icgLabel.prototype.getContentWidth = function() {
        var tW = this.wrap ? this.contentWidth(getMaxLenString(this.caption)) : this.contentWidth(this.caption);
        return tW + this.indent;
    };
    //
    function FontChange() {
        /**/
        this.autosize = this.autosize;
        this.resize();
    }
    function onResize() {
        if (this.width)
            this.labelBox.width = this.width;
        if (this.height)
            this.labelBox.height = this.height;
        return this;
    }
    var getMaxLenString = function(caption) {
        var max = 0,
            maxStr, arrayOfStrings = caption.split(' ');
        arrayOfStrings.forEach(function(item, i) {
            if (max < item.length) {
                max = item.length;
                maxStr = item;
            }
        });
        return maxStr;
    };
    var getContentWordsCount = function(caption){
        var arrayOfStrings = caption.split(' ');
        return arrayOfStrings.length;
    };
    var defaults = {
        caption        : '',
        indent         : 1,
        wrap           : false,
        align          : 'left',
        valign         : 'center',
        selectable     : false,
        autosize       : true,
        backgroundColor: 'inherit'
    };
    icgLabel.count = 0;
    return icgLabel;
}();

var icgEdit = function() {
    function icgEdit(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'iEdit_' + icgEdit.count;
        options.control = 'Edit';
        icgControl.call(this, options);
        this.name = 'Edit' + (icgEdit.count++);
        this.parser = undefined;
        this.timerId;
        var _value = options.text,
        _indent = options.indent,
        _readonly = false;
        Object.defineProperty(this, 'value', {
            get: function() {
                return _value;
            },
            set: function(val) {
                if(this.parser){
                    if((options.maxLength>0) && (val.toString().length <= options.maxLength)) {
                        _value = val;
                        if(this.editField.value != val)
                            this.editField.value = val;
                        this.onChange(this);
                    }
                }
                else{
                    _value = val;
                    if(this.editField.value != val)
                        this.editField.value = val;
                    if(!val)
                        this.editField.value = '';
                    this.onChange(this);
                }
            }
        });
        Object.defineProperty(this, 'indent', {
            get: function() {
                return _indent;
            },
            set: function(val) {
                var css = this.editField.style;
                _indent = val;
                css.paddingLeft = val + 'px';
                css.width = (this.width - this.indent - 3) + 'px';
            }
        });
        Object.defineProperty(this, 'readonly', {
            get: function() {
                return _readonly;
            },
            set: function(val) {
                _readonly = val;
                if (val) {
                    this.editField.setAttribute('readonly', '');
                    this.editField.style.backgroundColor = '#F3F3F3';
                    this.editField.style.borderBottom = '2px solid #F3F3F3';
                } else {
                    this.editField.removeAttribute('readonly');
                    this.editField.style.backgroundColor = '#FFFFFF';
                    this.editField.style.borderBottom = '2px solid #FFFFFF';
                }
            }
        });
        this.caption = options.caption || '';
        this.onFontChange = FontChange;
        this.change = onValueChange;
        this.focus = onFocus;
        this.blur = onBlur;
        this.changePosition = posChange;
        this.resize = onResize;
        this.type = options.type;
        this.maxLength = options.maxLength;
        this.Build();
    }
    icgEdit.prototype = Object.create(icgControl.prototype);
    icgEdit.prototype.constructor = icgEdit;
    icgEdit.prototype.onChange = new Function();
    icgEdit.prototype.Build = function() {
        var text = this.value ? this.value : '',
            css = 'position:absolute;top:0px;left:1px;height:15px;width:' + (this.width - this.indent - 3) + 'px;';
        css += 'font-size:inherit; font-family:inherit; line-height:' + this.font.size + 'px;';
        css += 'padding-left:' + this.indent + 'px;';
        var textFull = '<input class=\'' + 'simple' + '\' style=\'' + css + '\' value=\'' + text + '\'>';
        this.setHTML(textFull);
        this.editField = this.elm.firstElementChild;
        this.editField.setAttribute('id',this.name);
        this.editField.style.backgroundColor = '#FFFFFF';
        this.editField.style.borderTop = '1px solid #FFFFFF';
        this.editField.style.borderRight = '0px';
        this.editField.style.borderBottom = '2px solid #FFFFFF';
        this.editField.style.borderLeft = '0px';
        this.editField.setAttribute('autocomplete', 'off');
        this.editField.setAttribute('autocorrect', 'off');
        this.editField.setAttribute('autocapitalize', 'off');
        this.editField.setAttribute('spellcheck', 'false');
        this.editField.setAttribute('type', 'text');
        this.css.border = '1px solid #7F7F7F';
        this.editField.oninput = new Function(this.obj + '.change(); return false;');
        this.editField.onfocus = new Function(this.obj + '.focus(); return false;');
        this.editField.onblur = new Function(this.obj + '.blur(); return false;');
        this.event.onresize = new Function(this.obj + '.resize(); return false;');
        if(this.caption)
            this.setCaption(this.caption);
        if(this.maxLength>0)
            setCharLimit(this.name,this.maxLength);
        if(this.type == 'number')
            this.setNumberType();
        this.css.cursor = 'text';
    };
    icgEdit.prototype.setCaption = function(caption){
        if(!caption)
            return this;
        if(!this.label){
            this.label = new icgLabel({
                id            : this.name + 'Caption',
                parent        : this.parent,
                left          : -1000,
                top           : 0,
                width         : 1,
                caption       : caption,
                backgroudColor: 'inherit',
                zIndex        : this.css.zIndex
            });
        }
        else
            this.label.caption = caption;
        this.label.left = this.left - 2 - this.label.width;
        this.label.top = this.top + 2;
        this.label.autosize = true;
        return this;
    };
    icgEdit.prototype.setNumberType = function(){
        this.parser = new NumberParser();
        this.parser.decimalDigits = 0;
        var mask = new NumberMask(this.parser, this.name);
        mask.keyDownFunction = OnEditKeyDown;
    };
    icgEdit.prototype.onParentResize = function(msgType){
        // console.log("I'm " + this.control + " get message " + msgType.type +' form ' + msgType.observer.control + '(x: ' + msgType.observer.x + '\t y: ' + msgType.observer.y + ')');
        if(this.anchors.right){
            this.width = msgType.observer.width - (this.left + this.horizontalBorderW()) - this.indentRight;
            onResize.call(this);
        }
    };
    function OnEditKeyDown(event) {
        //Отбиваем ввод 0(ноль) первым символом
        if(!event.srcElement.value.length && event.keyCode == 48){
            event.srcElement.value ='';
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        }
    }
    function onResize() {
        // console.log('editresize');
        this.editField.style.width = (this.width - this.indent - 3) + 'px';
    }
    function FontChange() {
        if (this.css.fontWeight)
            this.editField.style.fontWeight = this.css.fontWeight;
        if (this.css.fontStyle)
            this.editField.style.fontStyle = this.css.fontStyle;
        if (this.css.color)
            this.editField.style.color = this.css.color;
    }
    function onFocus() {
        var lastValue = this.editField.value,
        eField = this.editField;
        this.css.border = '1px solid #0078D7';
        timerId = setInterval(function(){
            if(eField.value != lastValue){
                eField.parentNode.obj.value = eField.value;
                lastValue = eField.value;
            }
        },20);
    }
    function onBlur() {
        clearInterval(this.timerId);
        this.css.border = '1px solid #7F7F7F';
    }
    function posChange(){
        if(this.caption){
            this.label.left = this.left - 2 - this.label.width;
            this.label.top = this.top + 2;
        }
    }
    function onValueChange() {
        if (this.value !== this.editField.value)
            this.value = this.editField.value;
    }
    function setCharLimit(source,limit) {
        var limit = new SizeLimit(source, limit);
    }
    var defaults = {
        text           : '',
        height         : 21,
        width          : 150,
        backgroundColor: '#FFFFFF',
        wrap           : false,
        indent         : 2,
        align          : 'left',
        selectable     : true,
        maxLength      : -1,
        type           : 'text',
        autosize       : false
    };
    icgEdit.count = 0;
    return icgEdit;
}();

var icgMemo = function() {
    function icgMemo(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'iMemo_' + icgMemo.count;
        options.control = 'Memo';
        icgControl.call(this, options);
        this.name = 'Memo' + (icgMemo.count++);
        var _caption = options.caption || undefined,
            _limitBar = options.limitBar || false,
            _value = options.text,
            _maxLength = options.maxLength,
            _readonly = false;
        Object.defineProperty(this, 'maxlength', {
            get: function() {
                return _maxLength;
            },
            set: function(val) {
                _maxLength = val;
                if(val > 0)
                    this.limitbar = true
                else
                    this.limitbar = false;
            }
        });
        Object.defineProperty(this, 'caption', {
            get: function() {
                return _caption;
            },
            set: function(val) {
                _caption = val;
                if(!val){
                    this.title.caption = '';
                    this.TitlebarStateChange();
                    this.title.hide();
                }
                else{
                    this.title.caption = val;
                    if(this.title.elm.classList.contains('visuallyhidden')){
                        this.title.show();
                        this.TitlebarStateChange();
                    }
                }
            }
        });
        Object.defineProperty(this, "limitbar", {
            get: function() {
                return _limitBar;
            },
            set: function(val) {
                _limitBar = val;
                if(!val){
                    this.TitlebarStateChange();
                    this.limitBar.hide();
                }
                else{
                    if(this.limitBar.elm.classList.contains("visuallyhidden")){
                        this.limitBar.show();
                        this.TitlebarStateChange();
                    }
                }
            }
        });
        Object.defineProperty(this, 'value', {
            get: function() {
                return _value
            },
            set: function(val) {
                _value = val;
                if(this.textField.innerText != val)
                    this.textField.innerText = val;
                this.onChange(this);
            }
        });
        Object.defineProperty(this, 'readonly', {
            get: function() {
                return _readonly
            },
            set: function(val) {
                _readonly = val;
                if (val) {
                    this.textField.setAttribute('readonly', '');
                    this.textField.style.backgroundColor = '#F3F3F3';
                } else {
                    this.textField.removeAttribute('readonly');
                    this.textField.style.backgroundColor = '#FFFFFF';
                }
            }
        });
        this.Build();
        this.Change = textChange;
        this.Focus = focus;
        this.Blur = blur;
        this.css.cursor = 'text';
    }
    icgMemo.prototype = Object.create(icgControl.prototype);
    icgMemo.prototype.onChange = new Function();
    icgMemo.prototype.constructor = icgMemo;
    icgMemo.prototype.Build = function() {
        var lHeight = this.caption ? getStrContentSize(this.caption).height + 1: 0,
            boxTop = this.caption ? lHeight : 0,
            boxHeigth = this.height - lHeight - 2,
            boxWidth = this.width - 2,
            text = this.value ? this.value : '',
            css = 'position:absolute;top:0px;left:0px;height:' + (boxHeigth - 4)  + 'px; width:' + (boxWidth - 4) + 'px;';
        css += 'overflow-x:hidden; overflow-y:auto; border: 1px solid #FFFFFF;';
        css += 'font-size:inherit; font-family:inherit; line-height:' + this.font.size + 'px;';
        var textFull = '<textarea style=\'' + css + '\'>' + text + '</textarea>';
        this.box = new icgControl({
            id            : this.name + 'Box',
            parent        : this,
            left          : 0,
            top           : boxTop,
            height        : boxHeigth,
            width         : boxWidth,
            bacgroundColor: '#FFFFFF'
        });
        this.box.owner = this;
        this.box.css.border= '1px solid #7F7F7F';
        this.box.setHTML(textFull);
        this.box.elm.firstChild.setAttribute('id',this.name)
        this.textField = this.box.elm.firstElementChild;
        this.textField.style.backgroundColor = '#FFFFFF';
        this.textField.setAttribute('autocomplete', 'off');
        this.textField.setAttribute('autocorrect', 'off');
        this.textField.setAttribute('autocapitalize', 'off');
        this.textField.setAttribute('spellcheck', 'false');
        this.title = new icgLabel({
            id     : this.name + 'Caption',
            parent : this,
            left   : 0,
            top    : 0,
            height : lHeight,
            width  : this.width,
            backgroundColor: "inherit",
            caption: this.caption || ''
        });
        if(!this.caption)
            this.title.hide();
        this.limitBar = new icgLabel({
            parent         : this,
            left           : this.width - (getStrContentSize('9999/9999').width + 1),
            top            : 0,
            height         : lHeight,
            width          : getStrContentSize('9999/9999').width,
            autosize       : false,
            backgroundColor: "inherit"
        });
        this.limitBar.caption = '0/0';
        if(this.maxlength>0){
            this.limitBar.caption = '0/' + this.maxlength;
            setCharLimit(this.name,this.limitBar.name,this.maxlength);
        }
        this.limitBar.align = 'right';
        this.maxlength = this.maxlength;
        if(!this.limitBar)
            this.limitBar.hide();
        this.onFontChange = FontChange;
        this.textField.oninput = new Function(this.obj + '.Change(); return false;');
        this.textField.onfocus = new Function(this.obj + '.Focus(); return false;');
        this.textField.onblur = new Function(this.obj + '.Blur(); return false;');
        this.box.elm.onresize = this.BoxResize;
    };
    icgMemo.prototype.BoxResize = function() {
        this.obj.owner.textField.style.width = (this.obj.width - 4) + 'px';
        this.obj.owner.textField.style.height = (this.obj.height - 4) + 'px';
    };
    icgMemo.prototype.TitlebarStateChange = function() {
        var lHeight = boxTop = getStrContentSize('A').height;
        if(isEmpty(this.caption) && !this.limitbar)
            lHeight = boxTop = 0;
        this.box.top = boxTop;
        this.box.height = this.height - lHeight - 2;
    };
    icgMemo.prototype.onParentResize = function(msgType){
        if(this.anchors.right){
            this.width = msgType.observer.width - this.left - this.indentRight;
            var lHeight = this.caption ? getStrContentSize(this.caption).height + 1 : 0,
            boxTop = this.caption ? lHeight : 0,
            boxHeigth = this.height - lHeight - 2,
            boxWidth = this.width - 2;
            this.textField.style.width = (this.width - 4) + 'px';
            this.box.width = boxWidth;
            this.box.top = boxTop;
            this.box.height = boxHeigth;
            this.title.width = this.width;
            this.limitBar.left = this.obj.width - (getStrContentSize('9999/9999').width + 1);
        }
    };
    //
    function setCharLimit(source,output,limit) {
        var limit = new SizeLimit(source, limit);
        limit.output = output;
        limit.outputText = "${size}/${max}";
    }
    function FontChange() {
        if (this.css.fontWeight)
            this.textField.style.fontWeight = this.css.fontWeight;
        if (this.css.fontStyle)
            this.textField.style.fontStyle = this.css.fontStyle;
        if (this.css.color)
            this.textField.style.color = this.css.color;
    }
    function focus() {
        this.box.css.borderColor = '#0078D7';
    }
    function blur() {
        this.box.css.borderColor = '#7F7F7F';
    }
    function textChange() {
        if (this.value !== this.textField.value)
            this.value = this.textField.value;
    }
    var defaults = {
        caption       : '',
        text          : '',
        wrap          : false,
        width         : '140',
        height        : '100',
        backgroundColor: 'inherit',
        selectable    : true,
        maxLength     : -1,
        autosize      : false
    };
    icgMemo.count = 0;
    return icgMemo;
}();

var icgCheckBox = function() {
    function icgCheckBox(settings) {
        var options = _extend({}, defaults, settings);
        options.id = options.id || 'iCheckbox_' + icgCheckBox.count;
        options.control = 'Checkbox';
        icgControl.call(this, options);
        this.name = 'Checkbox' + (icgCheckBox.count++);
        this.checked = options.checked;
        var _value = this.checked;
        Object.defineProperty(this, 'value', {
            get: function() {
                return _value
            },
            set: function(val) {
                _value = val;
                if (!val) {
                    this.chkImage.firstElementChild.setAttribute('src', check_off);
                    this.checked = val;
                } else {
                    this.chkImage.firstElementChild.setAttribute('src', check_on);
                    this.checked = val;
                }
                this.onChange(this);
            }
        });
        var _caption = options.caption;
        Object.defineProperty(this, 'caption', {
            get: function() {
                return _caption
            },
            set: function(val) {
                _caption = val;
                this.chkText.innerText = val;
            }
        });
        this._align = options.align;
        Object.defineProperty(this, 'align', {
            get: function() {
                return this._align
            },
            set: function(val) {
                this._align = val;
                this.chkText.parentNode.align = val;
            }
        });
        this._valign = options.valign;
        Object.defineProperty(this, 'valign', {
            get: function() {
                return this._valign
            },
            set: function(val) {
                this._valign = val;
                this.chkText.parentNode.style.verticalAlign = (val == 'center') ? '' : val;
            }
        });
        var _readonly = false;
        Object.defineProperty(this, 'readonly', {
            get: function() {
                return _readonly;
            },
            set: function(val) {
                _readonly = val;
            }
        });
        this.onclick = click;
        this.selectable = options.selectable;
        this.indent = options.indent;
        this.Init();
        this.css.cursor = 'default';
    }
    icgCheckBox.prototype = Object.create(icgControl.prototype);
    icgCheckBox.prototype.constructor = icgCheckBox;
    icgCheckBox.prototype.onChange = new Function();
    icgCheckBox.prototype.Init = function() {
        var text = this.caption ? this.caption : this.name,
            img = this.checked ? check_on : check_off,
            src = '<img width=\'' + ICGL_CHK_WIDTH + '\' height=\'' + ICGL_CHK_HEIGHT + '\' id=\'' + this.id + '_imgchk\' src=\'' + img + '\' border=\'0\'>',
            cssCapt = 'text-decoration: none; cursor:default; color: #000000; padding-left:' + this.indent + 'px;',
            styledCapt = '<a style=\'' + cssCapt + '\' href=\'javascript:;\'>' + text + '</a>',
            styledChck = '<a style=\'padding-left:1px;cursor:default;\' href=\'javascript:;\'>' + src + '</a>',
            cellStyle = ' style=\'background-color:transparent\'',
            tRow = '<tr><td align=\'' + this._align + '\'' + ' valign=\'' + this._valign + '\' '+ cellStyle + '>' + styledChck + '</td>';
        tRow += '<td align=\'' + this._align + '\'' + ' nowrap valign=\'' + this._valign + '\' '+ cellStyle + '>';
        tRow += styledCapt + '</td></tr>';
        var textFull = '<table cellpadding=0 cellspacing=0 border=0>' + tRow + '</table>';
        this.setHTML(textFull);
        var checkPanel = this.elm.querySelector('TABLE'),
            checkCell = checkPanel.querySelectorAll('TD')[0],
            textCell = checkPanel.querySelectorAll('TD')[1];
        this.chkImage = checkCell.querySelector('A');
        this.chkImage.setAttribute('tabindex', -1);
        this.chkText = textCell.querySelector('A');
        this.onFontChange = FontChange;
        this.event.onclick = new Function(this.obj + '.onclick(); return false;');
        this.css.height = 'auto';
        this.css.width = 'auto';
    };
    function FontChange() {
        //
        this.autosize = this.autosize;
    }
    function click() {
        if(!this.readonly)
            this.value = !this.value;
    }
    var defaults = {
            caption   : '',
            indent    : 2,
            checked   : false,
            align     : 'left',
            valign    : 'top',
            selectable: false,
            backgroundColor: 'inherit',
            autosize  : false
        }
    icgCheckBox.count = 0;
    return icgCheckBox;
}();

var icgGroupBox = function() {
    function icgGroupBox(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'iGroupBox_' + icgGroupBox.count;
        options.name = 'GroupBox' + (icgGroupBox.count++);
        options.control = options.name;
        icgControl.call(this, options);
        var _caption = options.caption;
        Object.defineProperty(this, 'caption', {
            get: function() {
                return _caption;
            },
            set: function(val) {
                _caption = val;
                this.title.caption = val;
                if(val)
                    this.title.show()
                else
                    this.title.hide();
                this.setBoxSizing();
            }
        });
        this.resize = onResize;
        this.observation = true;
        this.Init();
        this.font.setFont();
    }
    icgGroupBox.prototype = Object.create(icgControl.prototype);
    icgGroupBox.prototype.constructor = icgGroupBox;
    icgGroupBox.prototype.Init = function() {
        var ctrl = this,
            text = this.caption ? this.caption : '';
        this.box = new icgControl({
            id              : this.name + 'Box',
            control         : this.name,
            parent          : this,
            left            : 0,
            top             : 8,
            height          : this.height - 10,
            width           : this.width - 2,
            backgroundColor : 'inherit'
        });
        this.box.css.border = '1px solid #DCDCDC';
        this.box.anchors.right = true;
        // this.box.observation = true;
        this.box.onParentResize = function(){
            // console.log('box.onParentResize: ' + this.id + '   parent: ' + ctrl.id)
            this.height = ctrl.height - 10;
            this.width = ctrl.width - 2;
        };
        this.title = new icgLabel({
            id              : this.name + 'Caption',
            control         : this.name,
            parent          : this,
            left            : 5,
            top             : 0,
            width           : 1,
            backgroundColor : 'inherit',
            caption         : text
        });
        this.title.autosize = true;
        // this.children = [];
        this.event.onresize = new Function(this.obj + '.resize(); return false;');
        this.css.cursor = 'default';
    };
    icgGroupBox.prototype.onParentResize = function(msgType){
        // console.log(msgType.observer.id + ' send me ' + this.id + ' ar: ' + this.anchors.right);
        if(this.anchors.right){
            // console.log('ow: ' + msgType.observer.width + ' tl: ' + this.x + ' indentRight: ' + this.indentRight);
            this.width = msgType.observer.width - this.left - this.indentRight;
        }
    }
    icgGroupBox.prototype.setBoxSizing = function(){
        this.box.top = Math.round(this.title.height / 2);
        this.box.width = (this.width - 2);
        this.box.height = (this.height - Math.round((this.title.height) / 2) - 2);
        return this;
    };
    icgGroupBox.prototype.onFontChange = function(font){
        if(this.title)
            this.title.font.toFont(font);
    }
    var onResize = function() {
        // console.log(this);
        this.setBoxSizing();
        if(this.observation && this.children.length){
            this.publish({type:'ParentResize',observer: this});
        }
        return false;
    }
    var defaults = {
        width  : 150,
        height : 105,
        caption: ''
    };
    icgGroupBox.count = 0;
    return icgGroupBox;
}();

var icgButtonImage = function() {
    function icgButtonImage(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'iButtonImage_' + icgButtonImage.count;
        options.control = 'ButtonImage';
        icgControl.call(this, options);
        this.name = 'ButtonImage' + (icgButtonImage.count++);
        this.left = options.left;
        this.top = options.top;
        this.right = options.right;
        this.width = options.width;
        this.css.cursor = 'default';
    }
    icgButtonImage.prototype = Object.create(icgControl.prototype);
    icgButtonImage.prototype.constructor = icgButtonImage;
    icgButtonImage.prototype.checkbox = false;
    icgButtonImage.prototype.preload = ButtonImagePreload;
    icgButtonImage.prototype.setImages = ButtonImageSetImages;
    icgButtonImage.prototype.build = ButtonImageBuild;
    icgButtonImage.prototype.activate = ButtonImageActivate;
    icgButtonImage.prototype.click = ButtonImageClick;
    icgButtonImage.prototype.down = ButtonImageDown;
    icgButtonImage.prototype.up = ButtonImageUp;
    icgButtonImage.prototype.over = ButtonImageOver;
    icgButtonImage.prototype.out = ButtonImageOut;
    icgButtonImage.prototype.change = ButtonImageChange;
    icgButtonImage.prototype.onClick = new Function();
    icgButtonImage.prototype.onDown = new Function();
    icgButtonImage.prototype.onUp = new Function();
    icgButtonImage.prototype.onOver = new Function();
    icgButtonImage.prototype.onOut = new Function();
    icgButtonImage.prototype.onSelect = new Function();
    icgButtonImage.prototype.onDeselect = new Function();
    icgButtonImage.prototype.onParentResize = new Function();

    function ButtonImageSetImages(imgOff, imgOn, imgRoll, dir) {
        if (!dir)
            dir = '';
        this.preload(this.obj + '.imgOff', imgOff ? dir + imgOff : '');
        this.preload(this.obj + '.imgOn', imgOn ? dir + imgOn : '');
        this.preload(this.obj + '.imgRoll', imgRoll ? dir + imgRoll : '');
        return this;
    }
    function ButtonImagePreload(imgObj, imgSrc) {
        if (imgSrc) {
            eval(imgObj + ' = new Image()');
            eval(imgObj + '.src = \'' + imgSrc + '\'');
            eval(imgObj + 's = true');
        } else eval(imgObj + 's = false')
    }
    function ButtonImageBuild() {
        this.setHTML('<img class = \'dropdown_button\' name=\'' + this.name + 'Img\'\' src=\'' + this.imgOff.src + '\' width=' + this.width + ' height=' + this.height + '>');
        return this;
    }
    function ButtonImageActivate() {
        this.elm.onclick = new Function(this.obj + '.click(); return false;');
        this.elm.onmousedown = new Function(this.obj + '.down(); return false;');
        this.elm.onmouseup = new Function(this.obj + '.up(); return false;');
        this.elm.onmouseover = new Function(this.obj + '.over(); return false;');
        this.elm.onmouseout = new Function(this.obj + '.out(); return false;');
        return this;
    }
    function ButtonImageClick() {
        //
        this.onClick();
    }
    function ButtonImageDown() {
        if (this.selected) {
            this.selected = false;
            if (this.imgOns)
                this.change(this.imgOn);
            this.onDeselect();
        } else {
            if (this.checkbox)
                this.selected = true;
            if (this.imgOns)
                this.change(this.imgOn);
            this.onSelect();
        }
        this.onDown()
    }
    function ButtonImageUp() {
        if (!this.selected) {
            if (this.imgRolls)
                this.change(this.imgRoll)
            else if (this.imgOns) this.change(this.imgOff);
        }
        this.onUp()
    }
    function ButtonImageOver() {
        if (this.imgRolls && !this.selected)
            this.change(this.imgRoll);
        this.onOver();
    }
    function ButtonImageOut() {
        if (this.imgRolls && !this.selected)
            this.change(this.imgOff);
        this.onOut();
    }
    function ButtonImageChange(img) {
        //
        iDoc.images[this.name + 'Img'].src = img.src;
    }

    var defaults = {
        left  : 0,
        top   : 0,
        width : 15,
        height: 15
    };
    icgButtonImage.count = 0;
    return icgButtonImage;
}();

var icgLookup = function() {
    function icgLookup(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'iLookup_' + icgLookup.count;
        options.control = 'Lookup';
        icgControl.call(this, options);
        this.name = 'Lookup' + (icgLookup.count++);
        this.caption = options.caption || '';
        this.timerId;
        var _value = options.text;
        Object.defineProperty(this, 'value', {
            get: function() {
                return _value
            },
            set: function(val) {
                _value = val;
                if(this.editField.value != val)
                    this.editField.value = val;
                if(!val)
                    this.editField.value = '';
                this.onChange(this);
            }
        });
        var _lookup = true;
        Object.defineProperty(this, 'lookup', {
            get: function() {
                return _lookup;
            },
            set: function(val) {
                var btnWidth = val ? BUTTON_WIDTH : 0;
                _lookup = val;
                btnWidth = this.readonly ? 0 : btnWidth;
                this.editField.style.width = (this.width - this.indent - 3 - btnWidth) + 'px';
                if (val) {
                    if (!this.readonly) {
                        this.selectBtn.show();
                        this.editField.setAttribute('readonly', '');
                    }
                } else {
                    this.selectBtn.hide();
                    if (!this.readonly)
                        this.editField.removeAttribute('readonly');
                }
            }
        });
        var _readonly;
        Object.defineProperty(this, 'readonly', {
            get: function() {
                return _readonly;
            },
            set: function(val) {
                _readonly = val;
                if (val) {
                    if (this.lookup) {
                        this.selectBtn.hide();
                        this.editField.style.width = (this.width - this.indent - 3) + 'px';
                    }
                    this.editField.setAttribute('readonly', '');
                    this.editField.style.backgroundColor = '#F3F3F3';
                    this.editField.style.borderBottom = '2px solid #F3F3F3';
                } else {
                    if (this.lookup)
                        this.lookup = this.lookup;
                    else
                        this.editField.removeAttribute('readonly');
                    this.editField.style.backgroundColor = '#FFFFFF';
                    this.editField.style.borderBottom = '2px solid #FFFFFF';
                }
            }
        });
        this.indent = options.indent;
        this.resize = onResize;
        this.change = onValueChange;
        this.focus = onFocus;
        this.blur = onBlur;
        this.changePosition = posChange;
        this.click = onButtonClick;
        this.Build();
        this.css.cursor = 'default';
    }
    icgLookup.prototype = Object.create(icgControl.prototype);
    icgLookup.prototype.constructor = icgLookup;
    icgLookup.prototype.onChange = new Function();
    icgLookup.prototype.onLookup = new Function();
    icgLookup.prototype.Build = function() {
        var text = this.value ? this.value : "",
            btnLeft = this.width - BUTTON_WIDTH - 2,
            btnTop = 2,
            css = 'position:absolute;top:0px;left:1px;height:15px;width:' + (this.width - this.indent - 3 - BUTTON_WIDTH) + 'px;';
        css += 'font-size:inherit; font-family:inherit; line-height:' + this.font.size + 'px;';
        css += 'padding-left:' + this.indent + 'px;';
        var textFull = '<input class=\'' + 'simple' + '\' style=\'' + css + '\' value=\'' + text + '\'>';
        this.setHTML(textFull);
        this.editField = this.elm.firstElementChild;
        this.editField.style.backgroundColor = '#FFFFFF';
        this.editField.style.borderTop = '1px solid #FFFFFF';
        this.editField.style.borderRight = '0px';
        this.editField.style.borderBottom = '2px solid #FFFFFF';
        this.editField.style.borderLeft = '0px';
        this.editField.setAttribute('autocomplete', 'off');
        this.editField.setAttribute('autocorrect', 'off');
        this.editField.setAttribute('autocapitalize', 'off');
        this.editField.setAttribute('spellcheck', 'false');
        this.editField.setAttribute('type', 'text');
        this.editField.setAttribute('readonly', '');
        this.selectBtn = new icgButtonImage({
            id: this.name + 'Button',
            parent: this,
            left: btnLeft,
            top: btnTop,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.selectBtn.setImages(lbtn_off, lbtn_on, lbtn_over).build().activate();
        this.css.border = '1px solid #7F7F7F';
        this.onFontChange = FontChange;
        this.event.onresize = new Function(this.obj + '.resize(); return false;');
        this.selectBtn.onClick = new Function(this.obj + '.click(); return false;');
        this.editField.oninput = new Function(this.obj + '.change(); return false;');
        this.editField.onfocus = new Function(this.obj + '.focus(); return false;');
        this.editField.onblur = new Function(this.obj + '.blur(); return false;');
        if(this.caption)
            this.setCaption(this.caption);
        return this;
    };
    icgLookup.prototype.setLookupSource = function(source){
        this.source = source;
    };
    icgLookup.prototype.setCaption = function(caption){
        if(!caption)
            return this;
        if(!this.label){
            this.label = new icgLabel({
                id: this.name + 'Caption',
                parent: this.parent,
                left: -1000,
                top: 0,
                width: 1,
                caption: caption
            });
        }
        else
            this.label.caption = caption;
        this.label.autosize = true;
        this.label.left = this.left - 2 - this.label.width;
        this.label.top = this.top + 2;
    };
    function posChange(){
        if(this.caption){
            this.label.left = this.left - 2 - this.label.width;
            this.label.top = this.top + 2;
        }
    }
    function onResize() {
        var btnWidth = this.lookup ? BUTTON_WIDTH : 0,
            btnLeft = this.width - BUTTON_WIDTH - 2;
        btnWidth = this.readonly ? 0 : btnWidth;
        this.selectBtn.left = btnLeft;
        this.editField.style.width = (this.width - this.indent - 4 - btnWidth) + 'px';
    }
    function FontChange() {
        if (this.css.fontWeight)
            this.editField.style.fontWeight = this.css.fontWeight;
        if (this.css.fontStyle)
            this.editField.style.fontStyle = this.css.fontStyle;
        if (this.css.color)
            this.editField.style.color = this.css.color;
    }
    function onValueChange() {
        if (this.value !== this.editField.value)
            this.value = this.editField.value;
    }
    function onFocus() {
        var lastValue = this.editField.value,
        eField = this.editField;
        this.css.borderColor = '#0078D7';
        timerId = setInterval(function(){
            if(eField.value != lastValue){
                eField.parentNode.obj.value = eField.value;
                lastValue = eField.value;
            }
        },100);
    }
    function onBlur() {
        clearInterval(this.timerId);
        this.css.borderColor = '#7F7F7F';
    }
    function onButtonClick() {
        //
        this.onLookup();
    }
    var defaults = {
            text           : '',
            indent         : 2,
            left           : 0,
            top            : 0,
            height         :21,
            width          : 110,
            backgroundColor: '#FFFFFF'
        },
        BUTTON_HEIGHT = 17,
        BUTTON_WIDTH = 17;
        icgLookup.count = 0;
    return icgLookup;
}();

var icgListBox = function() {
    function icgListBox(settings) {
        var options = _extend({}, defaults, settings);
        /*Уникальные св-ва компонента*/
        options.id = options.id || "iListBox" + icgListBox.count;
        options.name = "ListBox" + (icgListBox.count++);
        options.control = "ListBox";
        icgControl.call(this, options);
        /*Приватные св-ва компонента, установлены значения по умолчанию*/
        var _caption = options.caption,                       //Заголовок (если есть - отображается в верхнем левом углу)
        _itemSpacing = options.itemSpacing,                   //Горизонтальный отступ между элементами
        _indent = options.indent,                             //Правый отступ елементов
        _multiSelect = options.multiSelect,                   //При (true) разрешен множественный выбор
        _allowDeselect = options.multiSelect ? true : false,  //При (true) разрешено состояние, при котором ни один элемент не активен
        _toolBar = options.toolBar;
        /*Собственные св-ва компонента*/
        this.itemH = 0;                                   //Расчетная высота элементов
        this.selectedIndex = -1;                          //Текущий активнфй элемент
        this.selectedItems = [];                          //Массив активных элементов в случае разрешенного множественного выбора
        this.items = new Array();                         //Массив элементов списка (полный)
        /*Методы доступа к приватным св-вам компонента*/
        Object.defineProperty(this, "allowDeselect", {
            get: function() {
                return _allowDeselect;
            },
            set: function(val) {
                _allowDeselect = val;
            }
        });
        Object.defineProperty(this, "caption", {
            get: function() {
                return _caption;
            },
            set: function(val) {
                _caption = val;
                if(!val){
                    this.title.caption = "";
                    this.Redraw();
                    this.title.hide();
                }
                else{
                    this.title.caption = val;
                    if(this.title.elm.classList.contains("visuallyhidden")){
                        this.title.show();
                        this.Redraw();
                    }
                }
            }
        });
        Object.defineProperty(this, "itemSpacing", {
            get: function() {
                return _itemSpacing;
            },
            set: function(val) {
                _itemSpacing = val;
                var i,count = this.itemsCount;
                if(count > 0){
                    for(i = 0; i < count; i++){
                        this.items[i].css.borderBottom = '1px solid #DDD';
                    }
                    this.Redraw();
                }
            }
        });
        Object.defineProperty(this, "multiSelect", {
            get: function() {
                return _multiSelect;
            }
        });
        Object.defineProperty(this, "itemsCount", {
            get: function() {
                return this.items.length;
            }
        });
        Object.defineProperty(this, "indent", {
            get: function() {
                return _indent;
            },
            set: function(val) {
                _indent = val;
                var i,count = this.itemsCount;
                if(count > 0){
                    for(i = 0; i < count; i++){
                        this.items[i].indent = val;
                    }
                    this.Redraw();
                }
            }
        });
        Object.defineProperty(this, "toolBar", {
            get: function() {
                return _toolBar;
            },
            set: function(val) {
                _toolBar = val;
                if(!val){
                    this.Redraw();
                    this.toolbar.hide();
                }
                else{
                    if(this.toolbar.elm.classList.contains("visuallyhidden")){
                        this.toolbar.show();
                        this.Redraw();
                    }
                }
            }
        });
        // Constructor code.
        this.down = MouseDown;
        this.AddClick = new Function();
        this.DelClick = new Function();
        this.NewItem = AddItem;
        this.focus = onFocus;
        this.blur = onBlur;
        this.resize = onResize;
        this.Buid();
        this.indent = options.indent;
    }
    icgListBox.prototype = Object.create(icgControl.prototype);
    icgListBox.prototype.constructor = icgListBox;
    icgListBox.prototype.OnChange = new Function();
    icgListBox.prototype.Buid = function() {
        this.box = new icgControl({
            id             : this.name + "View",
            parent         : this,
            left           : 0,
            top            : 0,
            height         : this.height - 1,
            width          : this.width - 2,
            overflowY      : 'auto',
            backgroundColor: "#FFFFFF"
        });
        this.box.owner = this;
        this.box.css.border = '1px solid #7F7F7F';
        this.box.css.overflowY = 'auto';
        this.title = new icgLabel({
            id     : this.name + "Caption",
            parent : this,
            left   : 2,
            top    : 0,
            height : this.contentHeight(),
            width  : this.width,
            caption: this.caption || ""
        });
        if(!this.caption)
            this.title.hide();
        this.toolbar = new icgControl({
            id: this.name + "Toolbar",
            parent: this,
            left: this.width - 30,
            top: 0,
            height: this.contentHeight(),
            width: 30,
            backgroundColor: "#F0F0F0"
        });
        this.addBtn = new icgButtonImage({
            id    : this.name + 'ButtonAdd',
            parent: this.toolbar,
            left  : 0,
            top   : 0,
            width : BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.addBtn.owner = this;
        this.addBtn.setImages(add_off, add_on, add_over).build().activate();
        this.delBtn = new icgButtonImage({
            id    : this.name + 'ButtonDelete',
            parent: this.toolbar,
            left  : 15,
            top   : 0,
            width : BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.delBtn.owner = this;
        this.delBtn.setImages(delete_off, delete_on, delete_over).build().activate();
        if(!this.toolBar)
            this.toolbar.hide();
        this.event.onresize = new Function(this.obj + ".resize(); return false;");
        this.event.onfocus = new Function(this.obj + ".focus(); return false;");
        this.event.onblur = new Function(this.obj + ".blur(); return false;");
        this.addBtn.onClick = new Function(this.obj + '.AddClick(); return false;');
        this.delBtn.onClick = new Function(this.obj + '.DelClick(); return false;');
        this.css.cursor = "default";
        this.Redraw();
        return this;
    };
    icgListBox.prototype.Redraw = function() {
        var boxTop,boxHeigth;
        if(this.caption || this.toolBar)
            boxTop = this.contentHeight() + 1;
        else
            boxTop = 0;
        boxHeigth = this.height - boxTop - 2;
        this.box.top = boxTop;
        this.box.height = boxHeigth;
        if(this.itemsCount == 0)
            return;
        if(this.elm.clientWidth != this.items[this.itemsCount - 1].width)
            for(var i = 0; i < this.items.length; i++)
                this.items[i].width = this.elm.clientWidth;
    };
    icgListBox.prototype.Add = function() {
        if (!arguments[0])
            return false;
        var i, count, argsType = (typeof arguments[0] === 'string')? 'string' : 'object',
        argCount = arguments.length,objSettings;
        for (i = 0; i < argCount; i++) {
            try{
                if(typeof arguments[i] !== argsType)
                    throw new Error('Тип аргумента не соответствует заявленному!');
            }
            catch(e){
                alert(e.message);
                return false;
            }
            count = this.itemsCount;
            objSettings = {};
            objSettings.parent = this.box;
            objSettings.index = count;
            if(argsType == 'object'){
                objSettings.displayText = arguments[i].displayText;
                if("keyValue" in arguments[i])
                    objSettings.keyValue = arguments[i].keyValue;
                else
                    objSettings.keyValue = i;
            }
            else{
                objSettings.displayText = arguments[i];
                objSettings.keyValue = i;
            }
            this.NewItem(objSettings);
            this.indent = this.indent;
            this.itemSpacing = this.itemSpacing;
        }
        return this;
    };
    icgListBox.prototype.Delete = function(itemIndex) {
        var itemCount = this.itemsCount;
        if(!isNaN(itemIndex))
            if((itemIndex>=0) && (itemIndex<itemCount)){
                if(this.selectedIndex == itemIndex && !this.allowDeselect)
                    this.selectedIndex = -1;
                this.elm.firstChild.removeChild(this.items[itemIndex].elm);
                this.items.splice(itemIndex,1);
                this.Redraw();
            }
    };
    icgListBox.prototype.Clear = function() {
        this.elm.innerHTML = "";
        this.items = [];
        this.selectedIndex = -1;
        this.selectedItems = [];
    };
    icgListBox.prototype.onParentResize = function(msgType){
        if(this.anchors.right){
            this.w = msgType.observer.w - this.x - this.indentRight;
            this.box.resizeTo(this.width - 2,this.height - ifEmpty(this.title.height,0) - 2);
            this.box.moveTo(0,ifEmpty(this.title.height,0));
            if(this.toolbar)
                this.toolbar.left = this.width - 30;
            this.Redraw();
        }
    };
    function AddItem(settings) {
        var index = settings.index;
        this.items[index] = new ListItem(settings);
        this.items[index].owner = this;
        this.items[index].autosize = true;
        if(this.itemsCount == 0)
            this.itemH = this.items[index].height;
        this.items[index].elm.setAttribute("style","position:relative");
        this.items[index].elm.removeAttribute("top");
        this.items[index].elm.removeAttribute("left");
        this.items[index].event.onmousedown = new Function(this.obj+'.down(\''+this.items[index].id+'\'); return false;');
        this.itemSpacing = this.itemSpacing;
        this.Redraw();
    }
    function onResize() {
        this.box.resizeTo(this.width - 2,this.height - ifEmpty(this.title.height,0) - 2);
        this.box.moveTo(0,ifEmpty(this.title.height,0));
        if(this.toolbar)
            this.toolbar.left = this.width - 30;
        this.Redraw();
    }
    function onFocus() {
        //
        this.box.css.borderColor = "#0078D7";
    }
    function onBlur() {
        //
        this.box.css.borderColor = "#7F7F7F";
    }
    function MouseDown(id) {
        var j,
            i = -1,
            mSelect = this.multiSelect ? this.multiSelect : false,
            sItemsCount = this.selectedItems ? this.selectedItems.length : 0,
            cIndex = this.index, sIndex = null;
        for(j = 0; j < this.itemsCount; j++)
            if(this.items[j].id == id){
                i = j;
                break;
            }
        if(this.items[i].selected){
            if(this.allowDeselect){
                this.items[i].selected = false;
                if(mSelect){
                    for(j = 0; j < sItemsCount; j++)
                        if(this.selectedItems[j].index == cIndex){
                            sIndex = j;
                            break;
                        }
                    if(sIndex >= 0){
                        this.selectedItems.splice(sIndex,1);
                        if(this.selectedItems.length>=0)
                            this.selectedIndex = this.selectedItems[this.selectedItems.length - 1].index;
                    }
                }
                else
                    this.selectedIndex = -1;
            }
        }
        else{
            if(mSelect){
                this.items[i].selected = true;
                this.selectedIndex = i;
                this.selectedItems.push(this);
            }
            else{
                if(this.selectedIndex >= 0 && this.selectedIndex != i)
                    this.items[this.selectedIndex].selected = false;
                this.items[i].selected = true;
                this.selectedIndex = i;
            }
        }
    }
    function mouseUp(){
        /**/
        this.owner.OnChange();
    }
        //============ListItem templates for icgListBox
        function ListItem(settings) {
            try{
                if(!settings.parent)
                    throw new Error('Не указан объект контейнер!');
                if(!settings.displayText)
                    throw new Error('Не указан текст элемента списка!');
                if(typeof settings.index === "undefined")
                    throw new Error('Не указан индекс элемента списка!');
            }
            catch(e){
                alert(e.message);
                return null;
            }
            var options = {};
            options.parent = settings.parent;
            options.id = options.id || 'iListItem' + ListItem.count;
            options.name = 'ListItem' + (ListItem.count++);
            options.control = 'ListItem';
            icgControl.call(this, options);
            /*Приватные св-ва компонента, установлены значения по умолчанию*/
            var _index = settings.index,                    //индекс компонента в списке
            _visible = true,                                //компонент видимый
            _indent = 0,                                    //отступ слева
            _autosize = true,                               //авторазмер компонента по содержимому
            _align = 'left',                                //горизонтальное выравнивание по левому краю
            _valign = 'top',                                //вертикальное выравнивание по верхнему краю
            _keyValue = settings.keyValue || settings.index,//значение ключевого поля, если не задано при инициализации, оно равно index
            _displayText = settings.displayText,            //текст отображаемый в качестве элементв списка
            _selected = false;                              //активность текущего элемента списка
            /*Методы доступа к приватным св-вам компонента*/
            Object.defineProperty(this, 'visible', {
                get: function() {
                    return _visible;
                },
                set: function(val) {
                    _visible = val;
                    if(val)
                        this.show();
                    else
                        this.hide();
                }
            });
            Object.defineProperty(this, 'indent', {
                get: function() {
                    return _indent;
                },
                set: function(val) {
                    _indent = val;
                    this.itemText.style.paddingLeft = val + 'px';
                    this.autosize = this.autosize;
                }
            });
            Object.defineProperty(this, 'text', {
                get: function() {
                    return _displayText;
                },
                set: function(val) {
                    _displayText = val;
                    this.itemText.innerText = val;
                    this.autosize = this.autosize;
                }
            });
            Object.defineProperty(this, 'key', {
                get: function() {
                    return _keyValue;
                }
            });
            Object.defineProperty(this, 'autosize', {
                get: function() {
                    return _autosize;
                },
                set: function(val) {
                    _autosize = val;
                    if (val) {
                        var curWidth =  this.getContentWidth();
                        this.width = curWidth;
                        var curHeight = this.getContentHeight();
                        this.height = curHeight;
                    }
                }
            });
            Object.defineProperty(this, 'index', {
                get: function() {
                    return _index;
                },
                set: function(val) {
                    _index = val;
                }
            });
            Object.defineProperty(this, 'align', {
                get: function() {
                    return _align;
                },
                set: function(val) {
                    _align = val;
                    this.itemText.parentNode.align = val;
                }
            });
            Object.defineProperty(this, 'valign', {
                get: function() {
                    return _valign;
                },
                set: function(val) {
                    _valign = val;
                    this.itemText.parentNode.style.verticalAlign = (val == 'center') ? '' : val;
                }
            });
            Object.defineProperty(this, 'selected', {
                get: function() {
                    return _selected;
                },
                set: function(val) {
                    _selected = val;
                    if(val){
                        this.setBgColor(bgSelectedCol);
                        this.color = textSelectedCol;
                    }
                    else{
                        this.setBgColor(bgNormalCol);
                        this.color = textNormalCol;
                    }
                }
            });
            this.Build();
            // Constructor code.
            this.css.border = '0px solid #7F7F7F';
            this.css.cursor = 'default';
            this.autosize = true;
            if (this.width)
                this.itemBox.width = this.width;
        }
        ListItem.prototype = Object.create(icgControl.prototype);
        ListItem.prototype.constructor = ListItem;
        ListItem.prototype.Build = function() {
            var text = this.text ? this.text : this.name,
                textHeight = this.font.size + 3,
                css = 'line-height:' + textHeight + 'px; background-color:transparent;color:inherit; padding-left:' + this.indent + 'px;',
                styled = '<div class=\'item_text\' style=\'' + css + '\'>' + text + '</div>',
                cellStyle = ' style=\'background-color:inherit;color:inherit; vertical-align:' + this._valign + '\'',
                tCell = '<td align=\'' + this._align + '\' nowrap' + cellStyle + '>' + styled + '</td>',
                textFull = '<table width=' + this.width + 'px cellpadding=0 cellspacing=0 border=0><tbody><tr>' + tCell + '</tr></tbody></table>';
            this.setHTML(textFull);
            this.elm.classList.add('list_item');
            this.itemBox = this.elm.querySelector('TABLE');
            this.itemText = this.itemBox.querySelector('DIV');
            this.elm.onresize = resizeItem;
            return this;
        };
        ListItem.prototype.getContentHeight = function() {
            /**/
            return this.contentHeight();
        };
        ListItem.prototype.getContentWidth = function() {
            /**/
            return this.contentWidth(this.text);
        };
        function resizeItem() {
            if (this.obj.width)
                this.obj.itemBox.width = this.obj.width;
            if (this.obj.height)
                this.obj.itemBox.height = this.obj.height;
        };
        ListItem.count = 0;
        //=================================================
    var defaults = {
        height         : 81,
        width          : 140,
        backgroundColor:"inherit",
        /**/
        caption        : undefined,
        itemSpacing    : 0,
        indent         : 0,
        multiSelect    : false,
        toolBar        : false
    },
        BUTTON_HEIGHT    = 15,
        BUTTON_WIDTH     = 15,
        textNormalCol    = '#000000',
        textSelectedCol  = '#FFFFFF',
        bgNormalCol      = '#FFFFFF',
        bgSelectedCol    = '#0078D7',
        bgRolloverCol    = '#5AB7E3';
        icgListBox.count = 0;
    return icgListBox;
}();

var icgListBoxEx = function() {
    function icgListBoxEx(settings) {
        var options = _extend({}, defaults, settings);
        /*Уникальные св-ва компонента*/
        options.id = options.id || "iListBox" + icgListBoxEx.count;
        options.name = "ListBox" + (icgListBoxEx.count++);
        options.control = "ListBox";
        icgControl.call(this, options);
        /*Приватные св-ва компонента, установлены значения по умолчанию*/
        var _caption = options.caption,                       //Заголовок (если есть - отображается в верхнем левом углу)
        _itemSpacing = options.itemSpacing,                   //Горизонтальный отступ между элементами
        _indent = options.indent,                             //Правый отступ елементов
        _multiSelect = options.multiSelect,                   //При (true) разрешен множественный выбор
        _allowDeselect = options.multiSelect ? true : false,  //При (true) разрешено состояние, при котором ни один элемент не активен
        _toolBar = options.toolBar;
        /*Собственные св-ва компонента*/
        this.title = options.title || 'Наименование';
        this.itemH = 0;                                   //Расчетная высота элементов
        this.selectedIndex = -1;                          //Текущий активнфй элемент
        this.selectedItems = [];                          //Массив активных элементов в случае разрешенного множественного выбора
        this.items = new Array();                         //Массив элементов списка (полный)
        /*Методы доступа к приватным св-вам компонента*/
        Object.defineProperty(this, "allowDeselect", {
            get: function() {
                return _allowDeselect;
            },
            set: function(val) {
                _allowDeselect = val;
            }
        });
        Object.defineProperty(this, "caption", {
            get: function() {
                return _caption;
            },
            set: function(val) {
                _caption = val;
                if(!val){
                    this.title.caption = "";
                    this.Redraw();
                    this.title.hide();
                }
                else{
                    this.title.caption = val;
                    if(this.title.elm.classList.contains("visuallyhidden")){
                        this.title.show();
                        this.Redraw();
                    }
                }
            }
        });
        Object.defineProperty(this, "itemSpacing", {
            get: function() {
                return _itemSpacing;
            },
            set: function(val) {
                _itemSpacing = val;
                var i,count = this.itemsCount;
                if(count > 0){
                    for(i = 0; i < count; i++){
                        this.items[i].css.borderBottom = '1px solid #DDD';
                    }
                    this.Redraw();
                }
            }
        });
        Object.defineProperty(this, "multiSelect", {
            get: function() {
                return _multiSelect;
            }
        });
        Object.defineProperty(this, "itemsCount", {
            get: function() {
                return this.items.length;
            }
        });
        Object.defineProperty(this, "indent", {
            get: function() {
                return _indent;
            },
            set: function(val) {
                _indent = val;
                var i,count = this.itemsCount;
                if(count > 0){
                    for(i = 0; i < count; i++){
                        this.items[i].indent = val;
                    }
                    this.Redraw();
                }
            }
        });
        Object.defineProperty(this, "toolBar", {
            get: function() {
                return _toolBar;
            },
            set: function(val) {
                _toolBar = val;
                if(!val){
                    this.Redraw();
                    this.toolbar.hide();
                }
                else{
                    if(this.toolbar.elm.classList.contains("visuallyhidden")){
                        this.toolbar.show();
                        this.Redraw();
                    }
                }
            }
        });
        // Constructor code.
        this.down = MouseDown;
        this.AddClick = new Function();
        this.DelClick = new Function();
        this.NewItem = AddItem;
        this.focus = onFocus;
        this.blur = onBlur;
        this.resize = onResize;
        this.Buid();
        this.indent = options.indent;
    }
    icgListBoxEx.prototype = Object.create(icgControl.prototype);
    icgListBoxEx.prototype.constructor = icgListBoxEx;
    icgListBoxEx.prototype.OnChange = new Function();
    icgListBoxEx.prototype.Buid = function() {
        this.box = new icgControl({
            id             : this.name + "View",
            parent         : this,
            left           : 0,
            top            : 0,
            height         : this.height - 1,
            width          : this.width - 2,
            overflowY      : 'auto',
            backgroundColor: "#FFFFFF"
        });
        this.box.owner = this;
        this.box.css.border = '1px solid #7F7F7F';
        this.box.css.overflowY = 'auto';
        this.header = new icgControl({
            id: this.name + "Header",
            parent         : this,
            left           : 0,
            top            : 0,
            height         : this.contentHeight(),
            width          : this.width - 2,
            backgroundColor: "#F0F0F0"
        });
        this.header.owner = this.box;
        this.header.css.border = '1px solid #7F7F7F';
        this.header.css.overflow = 'hidden';
        var textHeight = this.font.size + 3,
                css = 'line-height:' + textHeight + 'px; background-color:transparent;color:inherit;padding-left:5px',
                styled = '<div class=\'item_text\' style=\'' + css + '\'>' + this.title + '</div>',
                cellStyle = ' style=\'background-color:inherit;color:inherit; vertical-align:middle' + '\'',
                tCell = '<td nowrap' + cellStyle + '>' + styled + '</td>';
                styled = '<div class=\'item_text\' style=\'' + css + '\'>' + '№' + '</div>';
            cellStyle = ' style=\'background-color:inherit;border-right:1px solid #DDDDDD;width:40px;color:inherit;vertical-align:middle' + '\'';
        var pCell = '<td nowrap' + cellStyle + '>' + styled + '</td>',
            textFull = '<table width=' + this.header.width + 'px cellpadding=0 cellspacing=0 border=0><tbody><tr>' + pCell + tCell + '</tr></tbody></table>';
            this.header.setHTML(textFull);
            this.header.elm.classList.add('list_item');


        this.title = new icgLabel({
            id     : this.name + "Caption",
            parent : this,
            left   : 2,
            top    : 0,
            height : this.contentHeight(),
            width  : this.width,
            caption: this.caption || ""
        });
        if(!this.caption)
            this.title.hide();
        this.toolbar = new icgControl({
            id: this.name + "Toolbar",
            parent: this,
            left: this.width - 30,
            top: 0,
            height: this.contentHeight(),
            width: 30,
            backgroundColor: "#F0F0F0"
        });
        this.addBtn = new icgButtonImage({
            id    : this.name + 'ButtonAdd',
            parent: this.toolbar,
            left  : 0,
            top   : 0,
            width : BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.addBtn.owner = this;
        this.addBtn.setImages(add_off, add_on, add_over).build().activate();
        this.delBtn = new icgButtonImage({
            id    : this.name + 'ButtonDelete',
            parent: this.toolbar,
            left  : 15,
            top   : 0,
            width : BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.delBtn.owner = this;
        this.delBtn.setImages(delete_off, delete_on, delete_over).build().activate();
        if(!this.toolBar)
            this.toolbar.hide();
        this.event.onresize = new Function(this.obj + ".resize(); return false;");
        this.event.onfocus = new Function(this.obj + ".focus(); return false;");
        this.event.onblur = new Function(this.obj + ".blur(); return false;");
        this.addBtn.onClick = new Function(this.obj + '.AddClick(); return false;');
        this.delBtn.onClick = new Function(this.obj + '.DelClick(); return false;');
        this.css.cursor = "default";
        this.Redraw();
        return this;
    };
    icgListBoxEx.prototype.Redraw = function() {
        var boxTop,boxHeigth;
        if(this.caption || this.toolBar)
            boxTop = this.contentHeight() + 17;
        else
            boxTop = this.contentHeight() + 1;
        boxHeigth = this.height - boxTop - 2;
        this.box.top = boxTop;
        this.box.height = boxHeigth;
        this.header.width = this.width - 2;
        this.header.elm.querySelector('TABLE').width = this.header.width;
        if(this.itemsCount == 0)
            return;
        if(this.elm.clientWidth != this.items[this.itemsCount - 1].width)
            for(var i = 0; i < this.items.length; i++)
                this.items[i].width = this.elm.clientWidth;
    };
    icgListBoxEx.prototype.Add = function() {
        if (!arguments[0])
            return false;
        var i, count, argsType = (typeof arguments[0] === 'string')? 'string' : 'object',
        argCount = arguments.length,objSettings;
        for (i = 0; i < argCount; i++) {
            try{
                if(typeof arguments[i] !== argsType)
                    throw new Error('Тип аргумента не соответствует заявленному!');
            }
            catch(e){
                alert(e.message);
                return false;
            }
            count = this.itemsCount;
            objSettings = {};
            objSettings.parent = this.box;
            objSettings.index = count;
            if(argsType == 'object'){
                objSettings.displayText = arguments[i].displayText;
                if("keyValue" in arguments[i])
                    objSettings.keyValue = arguments[i].keyValue;
                else
                    objSettings.keyValue = i;
            }
            else{
                objSettings.displayText = arguments[i];
                objSettings.keyValue = i;
            }
            this.NewItem(objSettings);
            this.indent = this.indent;
            this.itemSpacing = this.itemSpacing;
        }
        return this;
    };
    icgListBoxEx.prototype.Delete = function(itemIndex) {
        var itemCount = this.itemsCount;
        if(!isNaN(itemIndex))
            if((itemIndex>=0) && (itemIndex<itemCount)){
                if(this.selectedIndex == itemIndex && !this.allowDeselect)
                    this.selectedIndex = -1;
                this.elm.firstChild.removeChild(this.items[itemIndex].elm);
                this.items.splice(itemIndex,1);
                this.Redraw();
            }
    };
    icgListBoxEx.prototype.Clear = function() {
        this.elm.innerHTML = "";
        this.items = [];
        this.selectedIndex = -1;
        this.selectedItems = [];
    };
    icgListBoxEx.prototype.onParentResize = function(msgType){
        if(this.anchors.right){
            this.w = msgType.observer.w - this.x - this.indentRight;
            this.box.resizeTo(this.width - 2,this.height - ifEmpty(this.title.height,0) - 2);
            this.box.moveTo(0,ifEmpty(this.title.height,0));
            if(this.toolbar)
                this.toolbar.left = this.width - 30;
            this.Redraw();
        }
    };
    function AddItem(settings) {
        var index = settings.index;
        this.items[index] = new ListItem(settings);
        this.items[index].owner = this;
        this.items[index].autosize = true;
        if(this.itemsCount == 0)
            this.itemH = this.items[index].height;
        this.items[index].elm.setAttribute("style","position:relative");
        this.items[index].elm.removeAttribute("top");
        this.items[index].elm.removeAttribute("left");
        this.items[index].event.onmousedown = new Function(this.obj+'.down(\''+this.items[index].id+'\'); return false;');
        this.itemSpacing = this.itemSpacing;
        this.Redraw();
    }
    function onResize() {
        this.box.resizeTo(this.width - 2,this.height - ifEmpty(this.title.height,0) - 2);
        this.box.moveTo(0,ifEmpty(this.title.height,0));
        if(this.toolbar)
            this.toolbar.left = this.width - 30;
        this.Redraw();
    }
    function onFocus() {
        //
        this.box.css.borderColor = "#0078D7";
    }
    function onBlur() {
        //
        this.box.css.borderColor = "#7F7F7F";
    }
    function MouseDown(id) {
        var j,
            i = -1,
            mSelect = this.multiSelect ? this.multiSelect : false,
            sItemsCount = this.selectedItems ? this.selectedItems.length : 0,
            cIndex = this.index, sIndex = null;
        for(j = 0; j < this.itemsCount; j++)
            if(this.items[j].id == id){
                i = j;
                break;
            }
        if(this.items[i].selected){
            if(this.allowDeselect){
                this.items[i].selected = false;
                if(mSelect){
                    for(j = 0; j < sItemsCount; j++)
                        if(this.selectedItems[j].index == cIndex){
                            sIndex = j;
                            break;
                        }
                    if(sIndex >= 0){
                        this.selectedItems.splice(sIndex,1);
                        if(this.selectedItems.length>=0)
                            this.selectedIndex = this.selectedItems[this.selectedItems.length - 1].index;
                    }
                }
                else
                    this.selectedIndex = -1;
            }
        }
        else{
            if(mSelect){
                this.items[i].selected = true;
                this.selectedIndex = i;
                this.selectedItems.push(this);
            }
            else{
                if(this.selectedIndex >= 0 && this.selectedIndex != i)
                    this.items[this.selectedIndex].selected = false;
                this.items[i].selected = true;
                this.selectedIndex = i;
            }
        }
    }
    function mouseUp(){
        /**/
        this.owner.OnChange();
    }
        //============ListItem templates for icgListBoxEx
        function ListItem(settings) {
            try{
                if(!settings.parent)
                    throw new Error('Не указан объект контейнер!');
                if(!settings.displayText)
                    throw new Error('Не указан текст элемента списка!');
                if(typeof settings.index === "undefined")
                    throw new Error('Не указан индекс элемента списка!');
            }
            catch(e){
                alert(e.message);
                return null;
            }
            var options = {};
            options.parent = settings.parent;
            options.id = options.id || 'iListItem' + ListItem.count;
            options.name = 'ListItem' + (ListItem.count++);
            options.control = 'ListItem';
            icgControl.call(this, options);
            /*Приватные св-ва компонента, установлены значения по умолчанию*/
            var _index = settings.index,                    //индекс компонента в списке
            _visible = true,                                //компонент видимый
            _indent = 0,                                    //отступ слева
            _autosize = true,                               //авторазмер компонента по содержимому
            _align = 'left',                                //горизонтальное выравнивание по левому краю
            _valign = 'top',                                //вертикальное выравнивание по верхнему краю
            _keyValue = settings.keyValue || settings.index,//значение ключевого поля, если не задано при инициализации, оно равно index
            _displayText = settings.displayText,            //текст отображаемый в качестве элементв списка
            _selected = false;                              //активность текущего элемента списка
            /*Методы доступа к приватным св-вам компонента*/
            Object.defineProperty(this, 'visible', {
                get: function() {
                    return _visible;
                },
                set: function(val) {
                    _visible = val;
                    if(val)
                        this.show();
                    else
                        this.hide();
                }
            });
            Object.defineProperty(this, 'indent', {
                get: function() {
                    return _indent;
                },
                set: function(val) {
                    _indent = val;
                    this.itemText.style.paddingLeft = val + 'px';
                    this.itemKey.style.paddingLeft = val + 'px';
                    this.autosize = this.autosize;
                }
            });
            Object.defineProperty(this, 'text', {
                get: function() {
                    return _displayText;
                },
                set: function(val) {
                    _displayText = val;
                    this.itemText.innerText = val;
                    this.autosize = this.autosize;
                }
            });
            Object.defineProperty(this, 'key', {
                get: function() {
                    return _keyValue;
                },
                set: function(val) {
                    _keyValue = val;
                    this.itemKey.innerText = val;
                    this.autosize = this.autosize;
                }
            });
            Object.defineProperty(this, 'autosize', {
                get: function() {
                    return _autosize;
                },
                set: function(val) {
                    _autosize = val;
                    if (val) {
                        var curWidth =  this.getContentWidth();
                        this.width = curWidth;
                        var curHeight = this.getContentHeight();
                        this.height = curHeight;
                    }
                }
            });
            Object.defineProperty(this, 'index', {
                get: function() {
                    return _index;
                },
                set: function(val) {
                    _index = val;
                }
            });
            Object.defineProperty(this, 'align', {
                get: function() {
                    return _align;
                },
                set: function(val) {
                    _align = val;
                    this.itemText.parentNode.align = val;
                    this.itemKey.parentNode.align = val;
                }
            });
            Object.defineProperty(this, 'valign', {
                get: function() {
                    return _valign;
                },
                set: function(val) {
                    _valign = val;
                    this.itemText.parentNode.style.verticalAlign = (val == 'middle') ? '' : val;
                    this.itemKey.parentNode.style.verticalAlign = (val == 'middle') ? '' : val;
                }
            });
            Object.defineProperty(this, 'selected', {
                get: function() {
                    return _selected;
                },
                set: function(val) {
                    _selected = val;
                    if(val){
                        this.setBgColor(bgSelectedCol);
                        this.color = textSelectedCol;
                    }
                    else{
                        this.setBgColor(bgNormalCol);
                        this.color = textNormalCol;
                    }
                }
            });
            this.Build();
            // Constructor code.
            this.css.border = '0px solid #7F7F7F';
            this.css.cursor = 'default';
            this.autosize = true;
            if (this.width)
                this.itemBox.width = this.width;
        }
        ListItem.prototype = Object.create(icgControl.prototype);
        ListItem.prototype.constructor = ListItem;
        ListItem.prototype.Build = function() {
            var text = this.text ? this.text : this.name,
                textHeight = this.font.size + 3,
                css = 'line-height:' + textHeight + 'px; background-color:transparent;color:inherit; padding-left:' + this.indent + 'px;',
                styled = '<div class=\'item_text\' style=\'' + css + '\'>' + text + '</div>',
                cellStyle = ' style=\'background-color:inherit;color:inherit; vertical-align:' + this._valign + '\'',
                tCell = '<td align=\'' + this._align + '\' nowrap' + cellStyle + '>' + styled + '</td>';
            styled = '<div class=\'item_text\' style=\'' + css + '\'>' + (this.key + 1) + '</div>';
            cellStyle = ' style=\'background-color:inherit;border-right:1px solid #DDDDDD;width:40px;;color:inherit; vertical-align:' + this._valign + '\'';
            var pCell = '<td align=\'' + this._align + '\' nowrap' + cellStyle + '>' + styled + '</td>',
            textFull = '<table width=' + this.width + 'px cellpadding=0 cellspacing=0 border=0><tbody><tr>' + pCell + tCell + '</tr></tbody></table>';
            this.setHTML(textFull);
            this.elm.classList.add('list_item');
            this.itemBox = this.elm.querySelector('TABLE');
            this.itemKey = this.itemBox.querySelectorAll('DIV')[0];
            this.itemText = this.itemBox.querySelectorAll('DIV')[1];
            this.elm.onresize = resizeItem;
            return this;
        };
        ListItem.prototype.getContentHeight = function() {
            /**/
            return this.contentHeight();
        };
        ListItem.prototype.getContentWidth = function() {
            /**/
            return 47 + this.contentWidth(this.text);
        };
        function resizeItem() {
            if (this.obj.width)
                this.obj.itemBox.width = this.obj.width;
            if (this.obj.height)
                this.obj.itemBox.height = this.obj.height;
        };
        ListItem.count = 0;
        //=================================================
    var defaults = {
        height         : 81,
        width          : 140,
        backgroundColor:"inherit",
        /**/
        caption        : undefined,
        itemSpacing    : 0,
        indent         : 0,
        multiSelect    : false,
        toolBar        : false
    },
        BUTTON_HEIGHT    = 15,
        BUTTON_WIDTH     = 15,
        textNormalCol    = '#000000',
        textSelectedCol  = '#FFFFFF',
        bgNormalCol      = '#FFFFFF',
        bgSelectedCol    = '#0078D7',
        bgRolloverCol    = '#5AB7E3';
        icgListBoxEx.count = 0;
    return icgListBoxEx;
}();

var icgTabControl = function(){
    function icgTabControl(settings) {
        var options = _extend({}, defaults, settings);
        options.id = options.id || 'iTabControl' + icgTabControl.count;
        options.control = 'TabControl';
        icgControl.call(this, options);
        this.name = 'TabControl' + (icgTabControl.count++);
        this.items = new Set();
        this.sheets = [];
        var _selectedItem = -1;
        Object.defineProperty(this, 'selectedItem', {
            get: function() {
                return _selectedItem;
            },
           set: function(val){
                _selectedItem = val;
            }
        });
        Object.defineProperty(this, 'itemsCount', {
            get: function() {
                return this.items.size();
            }
        });
        this.Resize = resize;
        this.Build();
        this.css.cursor = 'default';
    }
    icgTabControl.prototype = Object.create(icgControl.prototype);
    icgTabControl.prototype.constructor = icgTabControl;
    icgTabControl.prototype.Build = function(){
        this.event.onresize = new Function(this.obj + '.Resize(); return false;');
        return this;
    }
    icgTabControl.prototype.getItem = function(indx){
        var lastIndx = this.itemsCount,item = undefined;
        if(lastIndx > 0){
            var item,itemsArr = this.items.toArray();
            for(var i = 0; i < lastIndx; i++)
                if(i==indx){
                    item = itemsArr[i];
                    break;
                }
        }
        return item;
    };
    icgTabControl.prototype.Add = function(args){
        try {
            if (arguments.length == 0)
                throw new InitError('Ошибка инициализации компонента:  Отсутствуют входные параметры!');
        } catch (e) {
            alert('Error init component: ' + e.message);
        }
        for(var i = 0, len = arguments.length; i < len; i++){
            this.items.add(new icgTabSheet({caption:arguments[i],parent:this,id: this.name + 'Tab'}));
        }
        return this;
    };
    icgTabControl.prototype.Render = function(){
        this.items.toArray()
            .filter(function(item){
                return item.visible;
            })
            .forEach(function(item,index,arr){
                if(index==0)
                    item.left =  2
                else
                    item.left = arr[index - 1].left + arr[index - 1].width + 2;
                if(item.active){
                    item.top = 0;
                    item.height = 23;
                    item.backgroundColor = '#FFFFFF';
                }
                else{
                    item.top = 3;
                    item.height = 20;
                    item.backgroundColor = '#F0F0F0';
                }
            });
    };
    icgTabControl.prototype.onParentResize = function(msgType){
        if(this.anchors.right){
            setItemsSize(this);
            this.w = msgType.observer.w - this.x - this.indentRight;
        }
    };
    function resize(){
        setItemsSize(this);
    };
    function setItemsSize(control){
        control.items.foreach(
            function(item){
                item.Sheet.height = item.parent.height - 26;
                item.Sheet.width = item.parent.width - 2;
                if(item.observation && item.children.length){
                    item.publish({type:'ParentResize',observer: item});
                }
            });
    };
        function icgTabSheet(settings) {
            try {
                if(!settings.parent)
                    throw new InitError('Ошибка инициализации компонента: Не определен компонент контейнер!');
                if(!settings.caption)
                    throw new InitError('Ошибка инициализации компонента: Не задан текст заголовка закладки!');
                if(Object.getPrototypeOf(settings.parent) !== icgTabControl.prototype)
                    throw new Error("В качестве объекта контейнера должен выступать компонент iTabControl!");
            } catch (e) {
                alert('Error init component: ' + e.message);
            }
            this.settings = {};
            this.parent = this.settings.parent = settings.parent;
            this.index = this.parent.itemsCount;
            this.caption = settings.caption;
            this.settings.id = 'iTab' + icgTabSheet.count;
            this.settings.width = indentLeft + getStrContentSize(settings.caption).width + indentRight;
            if(this.parent.itemsCount==0){
                this.settings.top = 0;
                this.settings.left = 2;
                this.settings.height = 23;
                this.settings.backgroundColor = '#FFFFFF';
            }
            else{
                var prev = this.parent.getItem(this.index - 1);
                this.settings.top = 3;
                this.settings.left = prev.left + prev.width + 2;
                this.settings.height = 20;
                this.settings.backgroundColor = '#F0F0F0';
            }
            icgControl.call(this, this.settings);
            this.active = null;
            Object.defineProperty(this, 'selected', {
                get: function() {
                    return this.active;
              },
                set: function(val){
                    if(val!==this.active){
                        this.active = val;
                        this.onStateChange();
                    }
                }
            });
            var _visible = true;
            Object.defineProperty(this, 'visible', {
                get: function() {
                    return _visible;
                },
                set: function(val){
                    if(val!==_visible){
                        if(_visible){//если вкладка видима
                            if(this.selected){//если вкладка активна
                                if(this.parent.itemsCount>1){//если в наборе больше одной вкладки
                                    if(this.index == 0){//если это первая вкладка, активируем следующую вкладку
                                        next = this.parent.getItem(this.index + 1);
                                        next.Activate();
                                    }
                                    else{//если не первая - активируем предыдущую вкладку
                                        prev = this.parent.getItem(this.index - 1);
                                        prev.Activate();
                                    }
                                }
                            }
                            this.css.setProperty('display','none');//делаем ее невидимой
                        }
                        else{//если вкладка невидима
                            this.css.removeProperty('display');//делаем ее видимой
                            if(this.index == 0)//если это первая вкладка, активируем ее
                                this.Activate();
                        }
                        _visible = val;
                        this.parent.Render();
                    }
                }
            });
            this.settings.control = 'Tab';
            this.name = 'TabControl' + (icgTabSheet.count++);
            this.Resize = resize;
            this.onclick = click;
            this.over = onOver;
            this.out = onOut;
            this.build();
        }
        icgTabSheet.prototype = Object.create(icgControl.prototype);
        icgTabSheet.prototype.constructor = icgTabSheet;
        icgTabSheet.prototype.build = function(){
            var lblTop,bBottom,css = this.css;
            if(this.index == 0){
                lblTop = 4;
                bBottom = true;
            }
            else{
                lblTop = 1;
                bBottom = false;
            }
            css.borderTop = '1px solid #D9D9D9';
            css.borderLeft = '1px solid #D9D9D9';
            css.borderRight = '1px solid #D9D9D9';
            if(bBottom) css.borderBottom = '1px solid #D9D9D9'
            else css.borderBottom = '0px solid #D9D9D9';
            css.borderRadius = "0.25em 0.25em 0px 0px";
            if(this.index == 0){
                css.borderBottomWidth = '1px';
                css.borderBottomColor = '#FFFFFF';
            }
            this.Label = new icgLabel({
                parent         : this,
                top            : lblTop,
                indent         : indentLeft,
                backgroundColor: 'inherit',
                caption        : this.caption
            });
            this.Sheet = new icgControl({
                parent         : this.parent,
                id             : this.name + 'TabSheet' + this.index,
                top            : 24,
                width          : this.parent.width - 2,
                height         : this.parent.height - 26,
                backgroundColor: '#F0F0F0'
            });
            this.Sheet.anchors.right = true;
            this.Sheet.indentRight = 2;
            Object.defineProperty(this.Sheet, 'visible', {
                get: function() {
                    return this.parent.visible;
                },
                set: function(val){
                    this.parent.visible = val;
                }
            });
            this.Sheet.css.border = '1px solid #D9D9D9';
            this.Sheet.css.zIndex = this.parent.css.zIndex;
            this.Sheet.onChange = new Function();
            this.parent.sheets[this.parent.sheets.length] = this.Sheet;
            this.Sheet.observation = true;
            if(this.index > 0)
                this.Deactivate()
            else
                this.Activate();
            this.event.onclick = new Function(this.obj + '.onclick(); return false;');
            this.event.onmouseover = new Function(this.obj + '.over(); return false;');
            this.event.onmouseout = new Function(this.obj + '.out(); return false;');
        }
        icgTabSheet.prototype.onStateChange = function(){
            if(this.active){
                if((this.index != this.parent.selectedItem)){
                    if(this.parent.selectedItem>=0){
                        prev = this.parent.getItem(this.parent.selectedItem);
                        prev.Deactivate();
                    }
                    this.parent.selectedItem = this.index
                }
            }
        }
        icgTabSheet.prototype.Activate = function(){
            this.Sheet.css.removeProperty("display")
            this.top = 0;
            this.height = 23;
            this.Label.top = 3;
            this.css.backgroundColor = '#FFFFFF';
            this.css.borderBottom = '1px solid #FFFFFF'
            this.selected = true;
            this.Sheet.onChange();
        }
        icgTabSheet.prototype.Deactivate = function(){
            this.Sheet.css.setProperty('display','none');
            this.top = 3;
            this.height = 20;
            this.Label.top = 1;
            this.css.backgroundColor = '#F0F0F0';
            this.css.borderBottom = '0px solid #FFFFFF'
            this.selected = false;
        }
        function click() {
            if(!this.selected)
                this.Activate();
        }
        function onOver() {
            if(!this.selected){
                this.css.backgroundColor = '#D8EAF9';
            }
        }
        function onOut() {
            if(!this.selected){
                this.css.backgroundColor = '#F0F0F0';
            }
        }
        icgTabSheet.count = 0;
    var defaults = {
        height         : 0,
        width          : 0,
        backgroundColor:'#F0F0F0'
        },
    indentLeft = 6,
    indentRight = 5;
    icgTabControl.count = 0;
    ////////////////////////
    return icgTabControl;
}();

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
                parentWidth = 0;
                parentHeight = 0;
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
    var anchors = (function(){
    var left = true,
        top = true,
        right = false,
        bottom = false,
        methods = {
          left: new Function(),
          top: new Function(),
          right: new Function(),
          bottom: new Function()
        };
    return {
        left: function(){
          if(arguments.length){
            left = (typeof arguments[0] == 'boolean') ? arguments[0] : left;
            if(typeof arguments[0] == 'boolean'){
              left = arguments[0];
              if(!left)
                methods.left = undefined
              if(arguments[1])
                methods.left = (typeof arguments[1] == 'function') ? arguments[1] : methods.left;
            }
          }
          else return left;
        },
        top: function(){
          if(arguments.length){
            if(typeof arguments[0] == 'boolean'){
              top = arguments[0];
              if(!top)
                methods.top = undefined
              else
                if(arguments[1])
                  methods.top = (typeof arguments[1] == 'function') ? arguments[1] : methods.top;
            }
              }
              else return top;
            },
            right: function(){
              if(arguments.length){
                if(typeof arguments[0] == 'boolean'){
                  right = arguments[0];
                  if(!right)
                    methods.right = undefined
                  else
                    if(arguments[1])
                      methods.right = (typeof arguments[1] == 'function') ? arguments[1] : methods.right;
                }
              }
              else return right;
            },
            bottom: function(){
               if(arguments.length){
                if(typeof arguments[0] == 'boolean'){
                  bottom = arguments[0];
                  if(!bottom)
                    methods.bottom = undefined
                  else
                    if(arguments[1])
                      methods.bottom = (typeof arguments[1] == 'function') ? arguments[1] : methods.bottom;
                }
              }
              else return bottom;
            },
            init: function(arg){
                var inPara = !isInstance(arg,Array) ? Array.prototype.slice.call(arguments).slice(0) : arg ;// Array.prototype.slice.call(arguments).slice(0);
                if(inPara.length){
                  for(var i=0;i<inPara.length;i++){
                    methods[inPara[i].type] = inPara[i].f;
                  }
                }
                else{
                  methods[inPara.type] = inPara.f;
                }
            },
            set: function(point,val){
              if(point)
                methods[point].call(point,val);
            }
        }
      }());
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

var PreventSelection = function(){

    function PreventSelection(){
        this.preventSelection = false;
        return this;
    }

    PreventSelection.prototype = {
        addHandler: function (element, event, handler){
            if (element.attachEvent)
                element.attachEvent('on' + event, handler)
            else if (element.addEventListener)
                element.addEventListener(event, handler, false);
        },
        removeSelection: function(){
            if (window.getSelection)
                try{
                    window.getSelection().removeAllRanges();
                }
                catch(e){
                    return;
                }
            else if (document.selection && document.selection.clear)
              document.selection.clear();
        },
        killCtrlA: function(event){
            var event = event || window.event,
                sender = event.target || event.srcElement;
            if (sender.tagName.match(/INPUT|TEXTAREA/i))
                return;
            var key = event.keyCode || event.which;
            if (event.ctrlKey && key == 'A'.charCodeAt(0)){  // 'A'.charCodeAt(0) можно заменить на 65
                this.removeSelection();
                if (event.preventDefault)
                    event.preventDefault()
                else
                    event.returnValue = false;
            }
        },
        On: function(element){
            var preventSel = this
            this.addHandler(element, 'mousemove', function(){
                if(preventSel.preventSelection)
                    preventSel.removeSelection();
            });
            this.addHandler(element, 'mousedown', function(event){
                var event = event || window.event,
                    sender = event.target || event.srcElement;
                preventSel.preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
            });
            this.addHandler(element, 'mouseup', function(){
                if (preventSel.preventSelection)
                    preventSel.removeSelection();
                preventSel.preventSelection = false;
            });
            this.addHandler(element, 'keydown', this.killCtrlA);
            this.addHandler(element, 'keyup', this.killCtrlA);
        }
    }
    return PreventSelection;
}();

iEvents.addHandler(document, "click", function(event) {
    var t = event.target,
    tName = event.target.localName,
    el = document.querySelectorAll('div[control=\'DropdownBox\'][active]'),
    c = el[0];
    if(!c)
        return false;
    if(tName == 'img'){
        owner = t.closest('div[control=\'ComboBox\']');
        if(owner && (c.obj.owner.name == owner.obj.name))
            if(el.length > 1)
                c = el[1]
            else
                return false;
    }
    if(tName == 'div'){
        owner = t.closest('div[control=\'DropdownBox\'][active]');
        if(owner)
            return false;
    }
    c.obj.owner.DropedDown();
    return true;
});
