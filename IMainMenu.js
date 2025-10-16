var IMainMenu = function(){
	function IMainMenu(settings){
		var _initialization = true;
        var options = _extend({}, defaults, settings);
        options.id = 'IMainMenu';
        options.control = 'MainMenu';
        options.width = options.parent ? options.parent.width : options.width || window.innerWidth - 4;
        icgControl.call(this, options);
        this.imagesPath = options.imagesPath;//путь к каталогу с графическими иконками для кнопок
        this.buttons = [];//хранилище для объектов кнопки
        this.handlers = {};
        //реализация собственного readonly-свойства "itemsCount", возвращающего кол-во кнопок меню
        Object.defineProperty(this, 'itemsCount', {
            get: function() {
                return this.buttons.length;
            }
        });
        var that = this;
        //Событие инициализации представления иерархии, настроено происходить
        //после загрузки первого root-узла (ИС) чтобы установить на нем selected,
        //тем самым запустив процесс обработки пользовательских событий с ассинхронной
        //подгрузкой данных по списку узлов верхнего уровня с уменьшением
		var _onInit = function(){
        	_initialization = false;
        	that.removeHandler('onInit',_onInit);
        	that.buttons.forEach(function(btn){btn.enabled = true;});
        }
        this.hide();
        this.create();
        this.addHandler('onInit',_onInit);
	};
	IMainMenu.prototype = Object.create(icgControl.prototype);
	IMainMenu.prototype.constructor = IMainMenu;
	IMainMenu.prototype.addHandler = function(type, handler){
        if (typeof this.handlers[type] == "undefined"){
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    };
    IMainMenu.prototype.fire = function(event){
        if (!event.target){
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array){
            var handlers = this.handlers[event.type];
            for (var i=0, len=handlers.length; i < len; i++){
                handlers[i](event);
            }
        }
    };
    IMainMenu.prototype.removeHandler = function(type, handler){
        if (this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            for (var i=0, len=handlers.length; i < len; i++){
                if (handlers[i] === handler){
                    break;
                }
            }
            handlers.splice(i, 1);
        }
    };
	IMainMenu.prototype.create = function(){
		var that = this;
		this.width = window.innerWidth - 6;
		resizilla(function(){that.width = window.innerWidth - 4;},50);
		return this;
	};
	IMainMenu.prototype.show = function(){
        this.css.visibility = 'visible';
        this.elm.classList.remove('visuallyhidden');
        this.buttons.forEach(function(item){
        	item.show();
        });
        return this;
	};
	IMainMenu.prototype.addItems = function(itemsObj){
		var prevItemWidth = (this.buttons.length>0) ? this.buttons[this.buttons.length-1].width : 0,
			prevItemLeft = (this.buttons.length>0) ? this.buttons[this.buttons.length-1].left : 0,
			l = this.itemsCount;
		for (var i=0; i<itemsObj.length; i++){
			this.buttons[l+i] = new IMenuButtonImage({
				parent:this,
				imgPath: this.imagesPath,
				left:prevItemLeft + prevItemWidth + 1,
				caption:itemsObj[l+i].caption,
				enabledImage:itemsObj[l+i].enabledImage,
				disabledImage:itemsObj[l+i].disabledImage
			});
			this.buttons[l+i].activate(itemsObj[l+i].command);
			prevItemLeft = this.buttons[l+i].left;
			prevItemWidth = this.buttons[l+i].elm.getBoundingClientRect().width;
			this.buttons[l+i].enabled = false;
		}
		return this;
	};
    var defaults = {
    	imagesPath : 'images/',
        height: 75,
        border: '1px solid #A0A0A0',
        marginTop : '2px',
        padding : '1px',
        backgroudColor: '#FFFFFF'
    };
	return IMainMenu;
}();

var IMenuButtonImage = function(){
	function IMenuButtonImage(settings) {
        var options = _extend({}, defaults, settings);
        options.id = 'IMenuButtonImage_' + IMenuButtonImage.count;
        options.control = 'MenuButtonImage';
        icgControl.call(this, options);
        this.css.border = '1px solid transparent';
        this.css.padding = '8px 2px 1px 2px';
        this.css.backgroundColor = options.parent.css.backgroundColor;
        this.hide();
        var _enabled = true;
        Object.defineProperty(this, 'enabled', {
            get: function() {
                return _enabled
            },
            set: function(val) {
                if(_enabled != val){
                	if(val){
                		this.change(this.imgEnable);
                		this.buttonCaption.elm.style.color = '#000';
                	}
                	else {
                		this.change(this.imgDisable);
                		this.buttonCaption.elm.style.color = '#8D8D8D';
                	}
                	_enabled = val;
                }
            }
        });
       	this.setImages(options.enabledImage,options.disabledImage,options.imgPath);
        this.name = 'MenuButtonImage' + (IMenuButtonImage.count++);
        this.create(options.caption);
	}
	inherit(IMenuButtonImage,EventTarget);
    IMenuButtonImage.prototype = Object.create(icgControl.prototype);
    IMenuButtonImage.prototype.constructor = IMenuButtonImage;
    IMenuButtonImage.prototype.activate = MenuButtonImageActivate;
    IMenuButtonImage.prototype.setImages = MenuButtonImageSetImages;
    IMenuButtonImage.prototype.preload = MenuButtonImagePreload;
    IMenuButtonImage.prototype.change = MenuButtonImageChange;
    IMenuButtonImage.prototype.click = MenuButtonImageClick;
    IMenuButtonImage.prototype.down = MenuButtonImageDown;
    IMenuButtonImage.prototype.up = MenuButtonImageUp;
    IMenuButtonImage.prototype.over = MenuButtonImageOver;
    IMenuButtonImage.prototype.out = MenuButtonImageOut;
    IMenuButtonImage.prototype.onClick = new Function();
    IMenuButtonImage.prototype.onDown = new Function();
    IMenuButtonImage.prototype.onUp = new Function();
    IMenuButtonImage.prototype.onOver = new Function();
    IMenuButtonImage.prototype.onOut = new Function();
    IMenuButtonImage.prototype.create = function(itemCaption){
    	this.ButtonImageBuild();
	    this.buttonCaption =  new icgLabel({
	        id            : this.id + 'Caption',
	        parent        : this,
	        top           : this.height - 24 - 2,
	        height        : 24,
	        caption       : itemCaption,
	        backgroudColor: 'inherit',
	        zIndex        : 1
	    });
	    this.buttonCaption.indent = 0;
	    this.buttonCaption.font.size = 10;
		this.buttonCaption.font.lineHeight = 12;
		this.buttonCaption.wrap = true;
		this.buttonCaption.autosize = true;
		this.buttonCaption.align = 'center';
		this.buttonCaption.elm.style.left = '';
		var curWidth = this.buttonCaption.width;
		this.buttonCaption.elm.querySelector('table').setAttribute('width',curWidth);
		this.width = curWidth;
		var imgElm = this.elm.querySelector('img'),
			imgMargin = Math.ceil((this.width - 32)/2);
		imgElm.style.marginLeft = imgMargin + 'px';
		imgElm.style.marginRight = imgMargin + 'px';
		this.activate();
    }
  	IMenuButtonImage.prototype.ButtonImageBuild = function(){
        this.setHTML('<img class = \'menu_button\' name=\'' + this.name + 'Img\'\' src=\'' + this.imgEnable.src  + '\' width=32 height=32>');
        return this;
    }
    function MenuButtonImageSetImages(imgEnable, imgDisable, /*imgRoll,*/ dir){
        if (!dir) dir = '';
        this.preload(this.obj + '.imgEnable', imgEnable ? dir + imgEnable : '');
        this.preload(this.obj + '.imgDisable', imgDisable ? dir + imgDisable : '');
        return this;
	}
	function MenuButtonImagePreload(imgObj, imgSrc){
        if (imgSrc) {
            eval(imgObj + ' = new Image()');
            eval(imgObj + '.src = \'' + imgSrc + '\'');
            eval(imgObj + 's = true');
        } else eval(imgObj + 's = false')
	}
    function MenuButtonImageActivate(command) {
        this.elm.onclick = new Function(this.obj + '.click(); return false;');
        this.elm.onmousedown = new Function(this.obj + '.down(); return false;');
        this.elm.onmouseup = new Function(this.obj + '.up(); return false;');
        this.elm.onmouseover = new Function(this.obj + '.over(); return false;');
        this.elm.onmouseout = new Function(this.obj + '.out(); return false;');
        if(command){
	        if(typeof command === 'function'){
	        	this.onClick = command;
	        }
	    }
        return this;
    }
    function MenuButtonImageClick(){
    	if(this.enabled)
    		this.onClick();
    }
    function MenuButtonImageDown(){
    	if(this.enabled){
	    	this.css.backgroundColor = '#75D6F0';
	    	this.css.border = '1px solid #75D6F0';
	    	this.onDown();
	    }
    }
    function MenuButtonImageUp(){
	    if(this.enabled){
	    	this.css.backgroundColor = '#D1E8FF';
	    	this.css.border = '1px solid #75D6F0';
	    	this.onUp();
	    }
    }
    function MenuButtonImageOver(){
    	if(this.enabled){
	    	this.css.backgroundColor = '#D1E8FF';
	    	this.css.border = '1px solid #75D6F0';
	    	this.onOver();
	    }
    }
    function MenuButtonImageOut(){
    	if(this.enabled){
	    	this.css.backgroundColor = 'inherit';
	    	this.css.border = '1px solid transparent';
	    	this.onOut();
	    }
    }
    function MenuButtonImageChange(img) {
        iDoc.images[this.name + 'Img'].src = img.src;
    }
    var defaults = {
        left  : 0,
        top   : 0,
        height: 72
    };
	IMenuButtonImage.count = 0;
	return IMenuButtonImage;
}();