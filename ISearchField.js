var ISearchField = function() {
    function ISearchField(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'ISearchField_' + ISearchField.count;
        options.control = 'SearchField';
        options.paddingLeft = 2;
        icgControl.call(this, options);
        this.name = 'SearchField' + (ISearchField.count++);
        this.timerId;
        var _value = undefined;
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
                    if(_value!=val){
                        _value = val;
                        if(this.editField.value != val)
                            this.editField.value = val;
                        if(!val)
                            this.editField.value = '';
                        this.onChange(this);
                    }
                }
            }
        });
        Object.defineProperty(this, 'indent', {
            get: function() {
                return 2;
            }
        });
        this.change = onValueChange;
        this.focus = onFocus;
        this.blur = onBlur;
        this.changePosition = posChange;
        this.type = options.type;
        this.maxLength = 512;
        iObserver.make(this);
        this.addSubscriber(options.parent.dispath);
        this.Build();
        //только для элемента ISearchPanel ширина поля ввода ISearchField устанавливается со смещением от правого
        //края ISearchPanel состовляет постоянное значение равное this.indentRight = 150 (пока для тестаS)
        //this.width = options.width;
    }
    ISearchField.prototype = Object.create(icgControl.prototype);
    ISearchField.prototype.onChange = new Function();
    ISearchField.prototype.constructor = ISearchField;
    ISearchField.prototype.Build = function() {
        var text = this.value ? this.value : '',
            css = 'position:absolute;top:0px;left:1px;height:15px;width:' + (this.width - this.indent - 3) + 'px;';
        css += 'font-size:inherit; font-family:inherit; line-height:' + this.font.size + 'px;';
        css += 'padding-left:' + this.indent + 'px;';
        var textFull = '<input style=\'' + css + '\' value=\'' + text + '\'>';
        this.setHTML(textFull);
        this.editField = this.elm.firstElementChild;
        this.editField.setAttribute('id',this.name);
        this.editField.style.backgroundColor = '#FFFFFF';
        this.editField.style.borderTop = '1px solid transparent';
        this.editField.style.borderRight = '0px';
        this.editField.style.borderBottom = '0px';
        this.editField.style.borderLeft = '0px';
        this.editField.setAttribute('autocomplete', 'off');
        this.editField.setAttribute('autocorrect', 'off');
        this.editField.setAttribute('autocapitalize', 'off');
        this.editField.setAttribute('spellcheck', 'false');
        this.editField.setAttribute('type', 'text');
        this.css.border = '1px solid #7F7F7F';
        this.editField.onfocus = new Function(this.obj + '.focus(); return false;');
        this.editField.onblur = new Function(this.obj + '.blur(); return false;');
        this.editField.oninput = new Function(this.obj + '.change(); return false;');
        this.setCaption();
        this.indentRight = 150;
        this.anchors.right = true;
        if(this.maxLength>0)
            setCharLimit(this.name,this.maxLength);
        this.css.cursor = 'text';
    };
    ISearchField.prototype.setCaption = function(){
        if(!this.label){
            this.label = new icgLabel({
                id            : this.name + 'Caption',
                parent        : this.parent,
                left          : -1000,
                top           : 0,
                width         : 1,
                caption       : this.caption,
                backgroudColor: 'inherit',
                zIndex        : this.css.zIndex
            });
        };
        this.label.left = this.left - 2 - this.label.width;
        this.label.top = this.top + 2;
        this.label.caption = '';
        this.label.width = 0;
        this.label.autosize = false;
    };
    function onFocus() {
        var lastValue = this.editField.value,
        eField = this.editField;
        this.css.border = '1px solid #0078D7';
        timerId = setInterval(function(){
            if(eField.value != lastValue){
                eField.parentNode.obj.value = eField.value;
                lastValue = eField.value;
            }
        },500);
    }
    function onBlur() {
        clearInterval(this.timerId);
        this.value = this.editField.value;
        this.css.border = '1px solid #7F7F7F';
    }
    function posChange(){
        if(this.caption){
            this.label.left = this.left - 2 - this.label.width;
            this.label.top = this.top + 2;
        }
    }
    function onValueChange() {
        if (this.value !== this.editField.value){
            this.value = this.editField.value;
            if(this.value.length>2)
                this.publish({type:'EnterText',observer: this, value:this.value});
        }
        if(!this.value.length)
            this.publish({type:'ClearText',observer: this});
    }
    function setCharLimit(source,limit) {
        var limit = new SizeLimit(source, limit);
    }
    var defaults = {
        text           : '',
        height         : 19,
        width          : 150,
        backgroundColor: '#FFFFFF',
        wrap           : false,
        align          : 'left',
        selectable     : true,
        maxLength      : -1,
        type           : 'text',
        autosize       : false
    };
    ISearchField.count = 0;
    return ISearchField;
}();