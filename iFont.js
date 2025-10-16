ILIB.namespace('ILIB.ui.iFont');
ILIB.ui.iFont = (function() {
    iFont = function(settings) {
        var _control,
            _cssStyle,
            _style,
            _variant,
            _weight,
            _size,
            _lineHeight,
            _family;
        var initialize = false,
            options = _extend({},defaults,settings);
        if(!options.control)
            throw new Error('Не задан элеиент управления!');
        _control = options.control;
        Object.defineProperty(this, 'control', {
            get: function() {
                return _control;
            }
        });
        if(_control instanceof HTMLElement)
            _cssStyle = _control.style
        else _cssStyle = _control.css;
        Object.defineProperty(this, 'cssStyle', {
            get: function() {
                return _cssStyle;
            },
            set: function(style){
                _cssStyle = style;
            }
        });
        _style = options.fontStyle;
        _variant = options.fontVariant;
        _weight = options.fontWeight;
        _family = options.fontFamily;
        Object.defineProperty(this, 'family', {
            get: function() {
                return _family;
            },
            set: function(val) {
                if(typeof val !== 'undefined'){
                    _family = val;
                    this.setFont(initialize);
                }
            }
        });
        _size = options.fontSize;
        Object.defineProperty(this, 'size', {
            get: function() {
                return _size;
            },
            set: function(val) {
                if(typeof val !== 'undefined'){
                    _size = val;
                    this.setFont(initialize);
                }
            }
        });
        _lineHeight = options.lineHeight;
        Object.defineProperty(this, 'lineHeight', {
            get: function() {
                return _lineHeight;
            },
            set: function(val) {
                if(typeof val !== 'undefined'){
                    _lineHeight = val;
                    this.setFont(initialize);
                }
            }
        });
        Object.defineProperty(this, 'italic', {
            get: function() {
                if(_style == 'italic')
                    return true
                else return false;
            },
            set: function(val) {
                if(typeof val == 'boolean'){
                    if(val)
                        _style = 'italic'
                    else _style = 'normal';
                    this.setFont(initialize);
                }
            }
        });
        Object.defineProperty(this, 'bold', {
            get: function() {
                if(_weight == 'bold')
                    return true
                else return false;
            },
            set: function(val) {
                if(typeof val == 'boolean'){
                    if(val)
                        _weight = 'bold'
                    else _weight = 'normal';
                    this.setFont(initialize);
                }
            }
        });
        initialize = true;
        this.setFont(initialize);
    };

    iFont.prototype = {
        constructor: iFont,
        get color(){return _cssStyle.color},
        set color(val){
            if(val === undefined)
                return this;
            _cssStyle.color = val;
            return this;
        },
        toString: function(){
            var res = 'normal ';
            if(this.italic)
                res = 'italic ';
            res += 'normal ';
            // if(_variant && _variant != 'normal')
            //     res += (_variant + ' ');
            if(this.bold)
                res += 'bold '
            else res += 'normal '
            res += (this.size + 'px');
            res += ('/' + this.lineHeight + 'px ');
            res += this.family;
            return res;
        },
        toFont: function(font){
            var sArr = font.split(' '),
                fFam = sArr.slice(4).join(' '),
                fPar = sArr.slice(0,3),
                fSlh = sArr.slice(3)[0].split('/'),
                fArr = Array.prototype.concat(fPar,fSlh,fFam);
            if(fArr[0] == 'normal')
                this.italic = false
            else this.italic = true;
            if(fArr[2] == 'normal')
                this.bold = false
            else this.bold = true;
            this.size = parseInt(fArr[3]);//parseInt(fArr[3].toString().replace(/px+$/, ""));
            this.lineHeight = parseInt(fArr[4]);
            this.family = fArr[5];
        },
        setFont: function(init){
            if(init){
                this.control.css.font = this.toString();
                onFontChange(this.control,this.toString());
            }
        }
    };

    function onFontChange(obj,font){
        if(typeof obj.onFontChange !== 'undefined')
            obj.onFontChange(font);
    }
    var defaults = {
        fontStyle      : 'normal',
        fontVariant    : 'normal',
        fontWeight     : 'normal',
        fontSize       : 12,
        lineHeight     : 15,
        fontFamily     : 'Segoe UI'
    };

    return iFont;
}());