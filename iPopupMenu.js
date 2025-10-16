var iPopupMenu = function(WIN){
		function iPopupMenu(settings) {
				var _maxItemSize = 0,
            _visible = false,
            options = _extend({}, defaults, settings);
        options.id = options.id || 'iPopupMenu_' + iPopupMenu.count;
        options.control = 'PopupMenu';
        icgControl.call(this, options);
        Object.defineProperty(this, "maxItemSize", {
            get: function() {
                return _maxItemSize;
            },
            set: function(val) {
              if(_maxItemSize < val)
                _maxItemSize = val;
            }
        });
        Object.defineProperty(this, "itemsCount", {
            get: function() {
                return this.items.length;
            }
        });
        this.skipClose = false;
        Object.defineProperty(this, 'visible', {
            get: function() {
                if(!this.elm) return false;
                if(this.css.display == 'none')
                    return false;
                else
                    return true;
            },
            set: function(val) {
                if(val){
                    WIN.activeMenu = this;
                    this.css.display = 'inherit';
                }
                else{
                    WIN.activeMenu = null;
                    this.css.display = 'none';
                }
            }
        });
        var _system;
        Object.defineProperty(this, "system", {
            get: function() {
                return _system;
            },
            set: function(val) {
              _system = val;
            }
        });
        var _group;
        Object.defineProperty(this, "group", {
            get: function() {
                return _group;
            },
            set: function(val) {
              _group = val;
            }
        });
        var _component;
        Object.defineProperty(this, "component", {
            get: function() {
                return _component;
            },
            set: function(val) {
              _component = val;
            }
        });
        this.name = 'PopupMenu' + (iPopupMenu.count++);
        this.visible = _visible;
        this.items = [];
		}
		iPopupMenu.prototype = Object.create(icgControl.prototype);
		iPopupMenu.prototype.constructor = iPopupMenu;
    iPopupMenu.prototype.Add = function(caption,func){
      var index = this.items.length;
      this.items[index] = new iMenuItem({parent:this,caption:caption,callback: func});
      this.items[index].owner = this;
      this.Render();
    };
    iPopupMenu.prototype.Render = function(){
      var itemSize = this.maxItemSize,
          tH = 0;
      this.items.forEach(function(el){
        if(el.caption){
          el.width = itemSize;
          tH += 23;
        }
        else{
          el.width = itemSize - 8;
          tH += 3;
        }
      });
      this.width = itemSize + 2;
      this.height = tH;
    };
    iPopupMenu.prototype.Show = function(){
      var v = false;
      this.items.forEach(function(item){
        if(item.enabled)
          v = true;
      });
      if(v)this.visible = true;
    };
    iPopupMenu.prototype.Hide = function(){
      this.visible = false;
    };
    iPopupMenu.count = 0;
    var defaults = {
        position       : 'absolute',
        display        : 'inherit',
        zIndex         : 99999,
        backgroundColor: '#F2F2F2',
        border         : '1px solid #CCCCCC',
        padding        : '2px 0px',
        boxShadow      : '3px 3px 3px 0px #8e8e8e',
        left           : 0,
        top            : 0,
        height         : 1,
        width          : 1
    };
    if(!WIN.activeMenu)
        WIN.activeMenu = null;
    return iPopupMenu;
}(window);

var iMenuItem = function(){
	function iMenuItem(settings) {
    var enterEventCount = 0;
    var leaveEventCount = 0;
    var _caption,
        _enabled,
        _align,
        _valign,
        options = _extend({}, defaults, settings);
    options.id = options.id || 'iMenuItem_' + iMenuItem.count;
    options.control = 'MenuItem';
    icgControl.call(this, options);
    this.name = 'MenuItem' + (iMenuItem.count++);
    Object.defineProperty(this, "enabled", {
      get: function() {
        return _enabled;
      },
      set: function(value) {
        if(!typeof value === "boolean")
          return;
        _enabled = value;
        if(value)
          this.color = '#000000'
        else
          this.color = '#6D6D6D';
          // this.color = '#939393';
      }
    });
    this.indent = options.indent;
    this.caption = options.caption || this.name;
    this.css.position = 'relative';
    if(this.caption != '-'){
      this.callback = options.callback || undefined;
      this.Build(this.callback);
    }
    else{
      this.css.borderBottom = '1px solid #CCCCCC';
      this.caption = '';
    }
    return this;
	}
  iMenuItem.prototype = Object.create(icgControl.prototype);
  iMenuItem.prototype.constructor = iMenuItem;
  iMenuItem.prototype.Build = function() {
      var text = this.caption;
      var ctrlStyle = window.getComputedStyle(this.elm),
          fStyle = [];
      fStyle.push(ctrlStyle.fontStyle);
      fStyle.push(ctrlStyle.fontVariant);
      fStyle.push(ctrlStyle.fontWeight);
      fStyle.push(ctrlStyle.fontSize);
      fStyle.push(ctrlStyle.fontFamily);
      var captionWidth  = Math.ceil(measureWidth(text,fStyle.join(' '))) + this.indent,
      itemHeight = (parseInt(this.css.fontSize) + 3) + 6,
      css = 'line-height:inherit; background-color:inherit; padding:0px ' + this.indent + 'px',
      styled = '<div style=\'' + css + '\' control=\'MenuItem\' >' + text + '</div>',
      tImgL = '<td width="' + itemHeight + '" nowrap="" align="center"></td>',
      tCell = '<td nowrap="" align="left">' + styled + '</td>',
      tImgR = '<td width="' + itemHeight + '" nowrap="" align="center"></td>',
      tRow = '<tr height = ' + itemHeight + '>' + tImgL + tCell + tImgR + '</tr>',
      textFull = '<table width=100% height=' + itemHeight + ' cellpadding=0 cellspacing=0 border=0>';
      textFull += tRow;
      textFull += '</table>';
      this.setHTML(textFull);
      this.height = itemHeight;
      var itemSize = captionWidth + itemHeight * 2;
      this.parent.maxItemSize = itemSize;
      this.width = itemSize;
      iEvents.addHandler(this.elm,'mouseenter',onOver);
      iEvents.addHandler(this.elm,'mouseleave',onOut);
      iEvents.addHandler(this.elm,'click',onClick);
      this.enabled = true;
      return this;
  };

  var onOver = function(event){
    if(event.target.obj.enabled)
      event.target.obj.setBgColor('#91C9F7')
    else
      event.target.obj.setBgColor('#E6E6E6');
  }
  var onOut = function(event){
    event.target.obj.setBgColor('inherit');
  }
  var onClick = function(event){
    event.preventDefault();
    if(this.obj.enabled){
      this.obj.parent.skipClose = false;
      this.obj.owner.visible = false;
      if(this.obj.callback)
        this.obj.callback(this.obj.owner.system,this.obj.owner.group,this.obj.owner.component);
    }
    else
      event.stopPropagation();
  }
  var defaults = {
      position       : 'relative',
      indent         : 2,
      align          : 'left',
      valign         : 'center',
      backgroundColor: 'inherit',
      borderLeft     : '0px solid #CCCCCC',
      borderTop      : '0px solid #CCCCCC',
      borderRight    : '0px solid #CCCCCC',
      borderBottom   : '0px solid #CCCCCC',
      margin         : '1px 1px 2px 1px',
      width          : '100%',
      cursor         : 'default'
  };
  iMenuItem.count = 0;
	return iMenuItem;
}();
