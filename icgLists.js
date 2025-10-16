var icgField = function() {
    function icgField(settings) {
        var options = _extend({}, defaults, settings),
            _visible = true,                    //элемент видимый
            _readonly = false,
            _indent = 0,
            _valign = options.valign || "top",  //вертикальное выравнивание по верхнему краю
            _text = options.text || "";          //текст элемента списка
        options.id = options.id || "iField_" + icgField.count;
        options.control = options.control || "Field";
        options.name = options.name || "Field" + (icgField.count++);
        icgControl.call(this, options);
        /*Св-ва компонента, установлены значения по умолчанию*/
        Object.defineProperty(this, 'valign', {
            get: function() {
                return _valign;
            },
            set: function(value) {
                if(!('top middle bottom'.indexOf(value) !== -1))
                    return;
                _valign = value;
                this.elm.querySelector('TD').setAttribute("valign",value);
                return value;
            }
        });
        Object.defineProperty(this, "visible", {
            get: function() {
                return _visible;
            },
            set: function(value) {
	        	if(!typeof value === "boolean")
	        		return;
            	_visible = value;
	        	if(value && this.elm.classList.contains("visuallyhidden")){
	        		this.elm.classList.remove("visuallyhidden");
	        		return true;
	        	}
	        	else{
	        		if(!this.elm.classList.contains("visuallyhidden"))
	        			this.elm.classList.add("visuallyhidden");
	        		return false;
	        	}
            }
        });
        Object.defineProperty(this, "text", {
            get: function() {
                return _text;
            },
            set: function(value) {
	        	if(_text != value){
	        		_text = value;
	        		this.elm.querySelector('DIV').innerHTML = value;
    				return value;
	        	}
            }
        });
        Object.defineProperty(this, "readonly", {
            configurable: true,
            get: function() {
                return _readonly;
            },
            set: function(value) {
                if(!typeof value === "boolean")
                    return;
                _readonly = value;
                if(value)
                    this.setBgColor(bgReadonlyCol);
                else
                    this.setBgColor(bgNormalCol);
            }
        });
        Object.defineProperty(this, 'indent', {
            get: function() {
                return _indent;
            },
            set: function(value) {
                var div = this.elm.querySelector('DIV');
                if(!typeof value === "number")
                    return;
                _indent = value;
                div.style.paddingLeft = value + "px";
                div.style.width = this.width - value;
            }
        });
        if(!options.height)
        	this.height = this.contentHeight();
    	if(!options.width && options.text)
    		this.width = this.contentWidth(options.text);
        // this.preventSelection = new PreventSelection();
        this.sizeChange = resize;
        this.build();
        this.indent = options.indent || 0;
    }
    icgField.prototype = Object.create(icgControl.prototype);
    icgField.prototype.build = function(){
        var css = 'line-height:' + this.height + 'px; background-color:inherit;color:inherit; padding-top: 1px;',
            styled = '<div class=\'item_text\' style=\'' + css + '\'>' + this.text + '</div>',
            cellStyle = '\'background-color:inherit;color:inherit;\'',
            tCell = '<tr><td align=\'left\' valign=\''+ this.valign +'\' nowrap style=' + cellStyle + '>' + styled + '</td></tr>',
            textFull = '<table width=' + this.width + 'px cellpadding=0 cellspacing=0 border=0 style=\'cursor:default\'>' + tCell + '</table>';
        this.setHTML(textFull);
        // this.preventSelection.On(this.elm);
        return this;
    };
    function resize(){
    	/**/
    	this.elm.querySelector('TABLE').setAttribute("width",this.clientWidth());
    }
    icgField.count = 0;
	var textNormalCol   = '#000000',
        bgNormalCol     = '#FFFFFF',
        bgReadonlyCol   = '#F3F3F3',
		defaults = {
			valign         : "top",
			text           : "",
			backgroundColor: bgNormalCol
	    };
    return icgField;
}();

var icgTextField = function() {
    function icgTextField(settings) {
        try{
            if(!settings.parent)
                throw new Error('Не указан объект контейнер!');
        }
        catch(e){
            alert(e.message);
            return null;
        }
        var options = settings;
        if(options.parent)
            if(!options.id)
                options.id = options.parent.name + 'TextField' + icgTextField.count;
        options.id = options.id || 'iTextField_' + icgTextField.count;
        options.name = 'TextField' + (icgTextField.count++);
        options.control = 'TextField';
        icgField.call(this, options);
    }
    icgTextField.prototype = Object.create(icgField.prototype);
    icgTextField.prototype.constructor = icgTextField;

    icgTextField.count = 0;
    return icgTextField;
}();

var icgComboBox = function() {
    function icgComboBox(settings) {
        var options = _extend({}, defaults, settings),
            _readonly,
            _indent,
            _value,
            _selectedItem = options.preSelect,      //выделенный эл-т списка, либо эл-т владеющий фокусом
            _multiSelect = false,     //При (true) разрешен множественный выбор
            _allowDeselect = false;  //При (true) разрешено состояние, при котором ни один элемент не активен
        options.id = options.id || 'iComboBox_' + icgComboBox.count;
        options.name = 'ComboBox' + (icgComboBox.count++);
        options.control = 'ComboBox';
        icgControl.call(this, options);
        this.dropdownCount = options.dropdownCount;
        this.multiSelect = false;
        Object.defineProperty(this, "multiSelect", {
            get: function() {
                return _multiSelect;
            }
        });
        Object.defineProperty(this, "allowDeselect", {
            get: function() {
                return _allowDeselect;
            }
        });
        Object.defineProperty(this, "readonly", {
            get: function() {
                return _readonly;
            },
            set: function(value) {
                if(!typeof value === "boolean")
                    return;
                _readonly = value;
                if(value){
                    this.selectBtn.hide();
                    var bBottom = this.height - this.textField.height - this.textField.getStyleProp("marginTop") * 2;
                    this.textField.border.color = "#F3F3F3";
                    this.textField.border.size = bBottom;
                    this.textField.border.bottom = true;
                }
                else{
                    this.textField.border.bottom = false;
                    this.selectBtn.show();
                }
                this.textField.readonly = value;
                this.render();
            }
        });
        Object.defineProperty(this, 'indent', {
            get: function() {
                return _indent;
            },
            set: function(value) {
                if(!typeof value === "number")
                    return;
                _indent = value;
                this.textField.indent = value;
                this.render();
            }
        });
        Object.defineProperty(this, "selectedItem", {
            get: function(){
                return _selectedItem;
            },
            set: function(index){
                if(!typeof value === "number")
                    return;
                if(!this.items.size){
                    _selectedItem = -1;
                    return;
                }
                this.selectItem(index);
                _selectedItem = index;
                this.onChange(this);
            }
        });
        Object.defineProperty(this, 'value', {
            get: function() {
                return _value;
            },
            set: function(value) {
                _value = value;
                this.textField.text = value;
            }
        });
        Object.defineProperty(this, "itemsCount", {
            get: function(){
                return this.items.size;
            }
        });
        this.itemH = this.contentHeight();
        this.items = new itemsList(this);
        this.dropDown = false;
        this.caption = options.caption || "";
        this.Focus = focus;
        this.Blur = blur;
        this.Resize = resize;
        this.ButtonClick = onButtonClick;
        this.Build();
        this.DropdownBox.MouseDown = mousedown;
        this.DropdownBox.MouseUp = mouseup;
        this.DropdownBox.Click = click;
        if(options.items)
             this.Init(options.items);
        this.indent = options.indent;
        this.selectedItem = _selectedItem;
    }
    icgComboBox.prototype = Object.create(icgControl.prototype);
    icgComboBox.prototype.constructor = icgComboBox;
    icgComboBox.prototype.onChange = new Function();
    icgComboBox.prototype.Build = function(){
        this.css.border = '1px solid #7F7F7F';
        if(!this.width)
            this.width = this.getContentWidth() + 2;
        this.selectBtn = new icgButtonImage({
            id    : this.name + 'Button',
            parent: this,
            left  : this.elm.getBoundingClientRect().width - BUTTON_WIDTH - this.getStyleProp("borderRight"),
            top   : -1,
            width : BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
        this.selectBtn.owner = this;
        this.selectBtn.checkbox = true;
        this.selectBtn.setImages(btn_off, btn_on, btn_over).build().activate();
        this.textField = new icgField({
            parent   : this,
            marginTop: 1,
            width    : this.selectBtn.left - 1
        });
        this.selectBtn.css.zIndex = parseInt(this.textField.css.zIndex) + 1;
        this.DropdownBox = new icgControl({
            id             : this.name + "DropdownBox",
            name           : "iDropdownBox",
            control        : "DropdownBox",
            parent         : "self",
            left           : 1,
            top            : 1,
            height         : this.itemH,
            width          : this.width,
            display        : "block",
            zIndex         : 9999,
            backgroundColor: "#FFFFFF",
            overflowY      : 'auto'
        });
        this.DropdownBox.owner = this;
        var b = this.DropdownBox.border;
        b.size = 1;
        b.color = "#CCCCCC";
        b.top = b.right = b.bottom = b.left = true;
        //this.DropdownBox.css.boxShadow = "1px 1px 1px 0px #8D8D8D";
        this.DropdownBox.hide();
        if(this.caption)
            this.setCaption(this.caption);
        this.selectBtn.onClick = new Function(this.obj + '.ButtonClick(); return false;');
        this.event.onresize = new Function(this.obj + '.Resize(); return false;');
        this.event.onfocusin = new Function(this.obj + '.Focus(); return false;');
        this.event.onfocusout = new Function(this.obj + '.Blur(); return false;');
        this.changePosition = changePosition;
        this.DropdownBox.event.onmousedown = new Function(this.DropdownBox.obj + '.MouseDown(event); return false;');
        this.DropdownBox.event.onmouseup = new Function(this.DropdownBox.obj + '.MouseUp(event); return false;');
        this.DropdownBox.event.onclick = new Function(this.DropdownBox.obj + '.Click(event); return false;');
        this.DropdownBox.render = this.listRender;
        return this;
    };
    icgComboBox.prototype.Init = function(source){
        for(var i = 0; i < source.length; i++)
            this.Add(source[i]);
        this.listRender();
        return this;
    };
    icgComboBox.prototype.listRender = function(){
        if(this.itemsCount < 0)
            return;
        var cWidth = this.DropdownBox.elm.clientWidth;
        this.items.foreach(function(item){
            item.DOMElement.width = cWidth;
        });
    }
    icgComboBox.prototype.setCaption = function(caption){
        if(!caption)
            return this;
        if(!this.label){
            this.label = new icgLabel({
                id     : this.name + 'Caption',
                parent : this.parent || "",
                left   : -1000,
                top    : 0,
                width  : 1,
                zIndex : this.css.zIndex,
                caption: caption// + ":"
            });
        }
        else
            this.label.caption = caption;
        this.label.autosize = true;
        this.label.left = this.left - 2 - this.label.width;
        this.label.top = this.top + 2;
    };
    icgComboBox.prototype.DropedDown = function() {
        if(!this.dropDown){
            this.render();
            this.DropdownBox.show();
            this.css.borderColor = "#0078D7";
            this.DropdownBox.css.borderColor = "#0078D7";
            this.dropDown = true;
            this.DropdownBox.elm.setAttribute('active');
            this.scrollToSelectedItem();
        }
        else{
            this.DropdownBox.hide();
            this.dropDown = false;
            this.DropdownBox.elm.removeAttribute('active');
            if(this.selectBtn.imgOn){
                this.selectBtn.change(this.selectBtn.imgOff);
                this.selectBtn.selected = false;
                this.css.borderColor = '#7F7F7F';
            }
        }
    };
    icgComboBox.prototype.render = function(){
        var btnWidth = this.readonly ? 1 : BUTTON_WIDTH,
            box = this.DropdownBox,
            winHeight,
            boxBottom;
        this.selectBtn.left = this.elm.getBoundingClientRect().width - btnWidth - this.getStyleProp("borderRight");
        this.textField.width = this.selectBtn.left - 1;
        box.left = getOffset(this.elm).left;
        if((this.elm.getBoundingClientRect().height + this.elm.getBoundingClientRect().top + box.elm.getBoundingClientRect().height + 2) <= window.innerHeight)
            box.top = getOffset(this.elm).top + this.height + 1;
        else
            box.top = getOffset(this.elm).top - box.elm.getBoundingClientRect().height + 1;
        box.width = this.width;
        this.listRender();
        this.label.left = this.left - 2 - this.label.width;
        this.label.top = this.top + 2;
    };
    icgComboBox.prototype.Add = function(text){
        if(!text)
            return;
        this.items.add(text);
        var maxH = this.dropdownCount * this.itemH,
            curH = this.itemsCount * this.itemH
            item = this.items.getNode(this.items.size - 1);
        if(maxH > curH)
            this.DropdownBox.height = curH;
        else
            this.DropdownBox.height = maxH;
    };
    icgComboBox.prototype.selectItem = function(i){
        var item = (i == -1) ? null : this.items.getNode(i),
            value = item ? item.text : "";
        if(i == -1){
            if(this.selectedItem >= 0)
                this.items.getNode(this.selectedItem ).DOMElement.selected = false;
        }
        if(this.selectedItem < 0 && item)
            item.DOMElement.selected = true;
        else{
            if(this.selectedItem != i){
                if(!this.multiSelect)
                    this.items.getNode(this.selectedItem ).DOMElement.selected = false;
                if(i>=0)
                    item.DOMElement.selected = true;
            }
        }
        this.value = value;
    };
    icgComboBox.prototype.scrollToSelectedItem = function(){
        if(this.selectedItem<0)
            return;
        var c = this.DropdownBox.elm,
            t = this.items.getNode(this.selectedItem ).DOMElement.elm;
            isElement = t && t.nodeType === 1,
            isNumber = Object.prototype.toString.call(t) === '[object Number]';
        if (isElement) {
            c.scrollTop = t.offsetTop;
        } else if (isNumber) {
            c.scrollTop = t;
        } else if (t === 'bottom') {
            c.scrollTop = c.scrollHeight - c.offsetHeight;
        } else if (t === 'top') {
            c.scrollTop = 0;
        }
    }
    function onButtonClick(){
        this.DropedDown();
        return false;
    }
    function focus(e) {
        this.css.borderColor = '#0078D7';
        return true;
    }
    function blur(e) {
        this.css.borderColor = '#7F7F7F';
        return true;
    }
    function resize(){
        if(this.dropDown)
            this.DropedDown();
        this.render();
    }
    function changePosition(){
        if(this.dropDown)
            this.DropedDown();
        this.render();
    }
    function mousedown(event){
        if(!event.srcElement.classList.contains("item_text"))
            return;
        // var i = this.owner.items.indexOf(event.srcElement.innerHTML),
        //     item = this.owner.items.getNode(i);
    }
    function mouseup(event){
        if(!event.srcElement.classList.contains("item_text"))
            return;
        var i = this.owner.items.indexOf(event.srcElement.innerHTML);
        if(this.owner.selectedItem != i)
            this.owner.selectedItem = i;
    }
    function click(event){
        if(event.srcElement.classList.contains("item_text")){
            if(this.owner.dropDown)
                this.owner.DropedDown();
        }
        return true;
    }
    var defaults = {
        dropdownCount  : 6,
        indent         : 1,
        preSelect      : -1,
        height         : 21,
        width          : 145,
        multiSelect    : false,
        allowDeselect  : false,
        items          : null,
        backgroundColor:'#FFFFFF'
    },
    BUTTON_HEIGHT = 23,
    BUTTON_WIDTH = 17;
    icgComboBox.count = 0;
    return icgComboBox;
}();

var icgCustomItem = function() {
    function icgCustomItem(settings) {
        try{
            if(!settings.parent)
                throw new Error('Не указан объект контейнер!');
        }
        catch(e){
            alert(e.message);
            return null;
        }
        var options = settings;
        options.id = options.id || options.parent.name + 'Item' + icgCustomItem.count;
        options.name = 'Item' + (icgCustomItem.count++);
        options.control = 'ListItem';
        options.position = 'relative';
        options.backgroundColor = options.parent.backgroundColor;
        icgField.call(this, options);
        /*Св-ва компонента, установлены значения по умолчанию*/
        var _align = options.align || "left",
            _selected = false;                  //активность текущего элемента списка
        Object.defineProperty(this, 'align', {
            get: function() {
                return _align;
            },
            set: function(value) {
                if(!('left center right'.indexOf(value) !== -1))
                    return;
                _align = value;
                this.elm.querySelector('TD').setAttribute("align",value);
                return value;
            }
        });
        Object.defineProperty(this, 'selected', {
            get: function() {
                return _selected;
            },
            set: function(value) {
                if(!typeof value === "boolean")
                    return;
                _selected = value;
                if (!value)
                    this.setBgColor(bgNormalCol);
                else
                    this.setBgColor(bgSelectedCol);
            }
        });
        if(!options.height)
            this.height = this.contentHeight();
        this.width = this.parent.width;
        this.sizeChange = resize;
        this.over = mouseOver;
        this.out = mouseOut;
        this.init();
    }
    icgCustomItem.prototype = Object.create(icgField.prototype);
    icgCustomItem.prototype.constructor = icgCustomItem;
    icgCustomItem.prototype.init = function(){
        this.event.onmouseover = new Function(this.obj + '.over(); return false;');
        this.event.onmouseout = new Function(this.obj + '.out(); return false;');
        // this.event.onmousedown = new Function(this.obj + '.down(); return false;');
        // this.event.onmouseup = new Function(this.obj + '.up(); return false;');
        return this;
    }
    icgCustomItem.prototype.getContentHeight = function(){
        /**/
        return this.contentHeight();
    };
    icgCustomItem.prototype.getContentWidth = function(){
        /**/
        return this.contentWidth(this.text);
    }
    function mouseOver() {
        /**/
        this.setBgColor(bgRolloverCol);
    };
    function mouseOut() {
        if (!this.selected) {
            this.setBgColor(bgNormalCol);
        } else {
            this.setBgColor(bgSelectedCol);
        }
    };
    function resize(){
        /**/
        this.elm.querySelector('TABLE').setAttribute("width",this.width);
    }
    icgCustomItem.count = 0;
    var textNormalCol   = '#000000',
        bgNormalCol     = '#FFFFFF',
        bgSelectedCol   = '#56B0FA',
        textSelectedCol = '#FFFFFF',
        bgRolloverCol   = '#91C9F7';
    return icgCustomItem;
}();

var icgStaticField = function() {
    function icgStaticField(settings) {
        var options = settings;
        options.id = options.id || 'iTextField_' + icgStaticField.count;
        options.name = 'TextField' + (icgStaticField.count++);
        options.control = 'TextField';
        icgField.call(this, options);
        Object.defineProperty(this, "readonly", {
            get: function() {
                return _readonly;
            },
            set: function(value) {
                if(!typeof value === "boolean")
                    return;
                _readonly = value;
                if(value)
                    this.elm.querySelector('DIV').style.backgroundColor = '#F3F3F3';
                else
                    this.elm.querySelector('DIV').style.backgroundColor = '#FFFFFF';
            }
        });
        this.Focus = focus;
        this.Blur = blur;
        this.Resize = resize;
        this.init();
    }
    icgStaticField.prototype = Object.create(icgField.prototype);
    icgStaticField.prototype.constructor = icgStaticField;
    icgStaticField.prototype.init = function(){
        var div = this.elm.querySelector('DIV');
        this.css.border = '1px solid #7F7F7F';
        div.style.height = this.elm.clientHeight - 2 + "px";
        div.style.lineHeight = this.elm.clientHeight - 4 + "px";
        this.event.onresize = new Function(this.obj + '.Resize(); return false;');
        this.event.onfocusin = new Function(this.obj + '.Focus(); return false;');
        this.event.onfocusout = new Function(this.obj + '.Blur(); return false;');
        if(!this.width)
            this.width = this.getContentWidth() + 2;
        return this;
    };
    icgStaticField.prototype.getContentHeight = function(){
        /**/
        return this.contentHeight();
    };
    icgStaticField.prototype.getContentWidth = function(){
        /**/
        return this.contentWidth(this.text);
    };
    function focus(e) {
        // if (document.selection) {
        //     var range = document.body.createTextRange();
        //     range.moveToElementText(this.textField.elm.querySelector('DIV'));
        //     range.select();
        // }
        this.css.borderColor = '#0078D7';
        return true;
    }
    function blur(e) {
        // document.selection.empty();
        this.css.borderColor = '#7F7F7F';
        return true;
    }
    function resize(){
        this.elm.querySelector('DIV').style.width = this.elm.clientWidth - 2 + "px";
    }
    icgStaticField.count = 0;
    return icgStaticField;
}();

var itemsList = function(){
    function textNode(value){
    	this.text = value.text;
    	this.previous = null;
    	this.next = null;
        this.DOMElement = value;
    }

    function itemsList(listControl) {
        try{
            if(Object.getPrototypeOf(listControl) !== icgComboBox.prototype)
                throw new Error("В качестве объекта контейнера должен выступать объект iComboBox!");
        }
        catch(e){
            alert(e.message);
            return;
        }
        this.listControl = listControl;
        this._length = 0;
        this.head = null;
        this.tail = null;
        //this.add.apply(this, arguments);
    }
    itemsList.prototype = {
        constructor: itemsList,
        get size() {
            return this._length;
        },
        indexOf: function(value){
        	var textArr = this.toStringArray(),
        		indx = -1;
        	for(var i = 0, length = textArr.length; i < length; i++)
        		if(textArr[i] == value){
        			indx = i;
        			break;
        		}
        	return indx;
        },
        insert: function(value,index){
        	var length = this._length,
    	        node = new textNode(new icgCustomItem({
                    parent: this.listControl.DropdownBox,
                    indent: 1,
                    text  : value
                }));
    	    if(index > length)
    	    	return;
        	if(!index){
        		var currentNode = this.head;
        		if(!length){
    		        this.head = node;
    		        this.tail = node;
        		}
        		else{
        			this.head = node;
        			this.head.next = currentNode;
        			currentNode.previous = node;
        		}
        	}
        	else{
        		if(index == length){
        			var currentNode = this.tail;
        			currentNode.next = node;
        			this.tail = node;
        			this.tail.previous = currentNode;
        		}
        		else{
        			var currentNode = this.getNode(index),
        				nextNode = currentNode.next;
        			currentNode.next = node;
        			nextNode.previous = node;
        			node.next = nextNode;
        			node.previous = currentNode;
        		}
        	}
        	this._length++;
        	return node;
        },
        add: function() {
    		for (var i = 0; i < arguments.length; i++) {
    			var value = arguments[i],
    				node = new textNode(new icgCustomItem({
                        parent: this.listControl.DropdownBox,
                        indent: 1,
                        text  : value
                    }));
    			if (this._length) {
    				this.tail.next = node;
    				node.previous = this.tail;
    	        	this.tail = node;
    			}
    			else {
    		        this.head = node;
    		        this.tail = node;
    		    }
    		    this._length++;
    		}
    	    return this;
        },
        foreach: function(f, context) {
    		var currentNode = this.head,
    	        length = this._length,
    	        count = 0;
    		if (length === 0)
    			return;
    	    while (count < length) {
    	    	f.call(context, currentNode);
    	        currentNode = currentNode.next;
    	        count++;
    	    }
    	},
    	remove: function(position) {
    	    var currentNode = this.head,
    	        length = this._length,
    	        count = 0,
    	        message = {failure: 'Failure: non-existent node in this list.'},
    	        beforeNodeToDelete = null,
    	        nodeToDelete = null,
    	        deletedNode = null;
    	    if (length === 0 || position < 0 || position >= length) {
    	        throw new Error(message.failure);
    	    }
    	    if (position === 0) {
    	        this.head = currentNode.next;
    	        if (!this.head) {
    	            this.head.previous = null;
    	        } else {
    	            this.tail = null;
    	        }
    	    } else if (position === this._length - 1) {
    	        this.tail = this.tail.previous;
    	        this.tail.next = null;
    	    } else {
    	        while (count <= position) {
    	            currentNode = currentNode.next;
    	            count++;
    	        }
    	        beforeNodeToDelete = currentNode.previous;
    	        nodeToDelete = currentNode;
    	        afterNodeToDelete = currentNode.next;
    	        beforeNodeToDelete.next = afterNodeToDelete;
    	        afterNodeToDelete.previous = beforeNodeToDelete;
    	        deletedNode = nodeToDelete;
    	        nodeToDelete = null;
    	    }
    	    this._length--;
    	    return message.success;
    	},
    	getNode: function(position) {
    	    var currentNode = this.head,
    	        length = this._length,
    	        count = 0,
    	        message = {failure: 'Failure: non-existent node in this list.'};
    	    if (length === 0 || position < 0 || position >= length) {
    	        throw new Error(message.failure);
    	    }
    	    while (count < position) {
    	        currentNode = currentNode.next;
    	        count++;
    	    }
    	    return currentNode;
    	},
    	toArray: function() {
            var a = [];
            this.foreach(function(v) {
                a.push(v);
            });
            return a;
        },
        toStringArray: function(){
            var a = [];
            this.foreach(function(v) {
                a.push(v.text);
            });
            return a;
        }
    }

    return itemsList;
}();