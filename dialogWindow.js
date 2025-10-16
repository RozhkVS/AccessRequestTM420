(function(window, $){
    $.fn.dialogWindow = function(option, settings) {
      if(typeof option === 'object'){
      settings = option;
      }
      else if(typeof option === 'string'){
        var elements = this.each(function(){
          var data = $(this).data('_iDlgWin');
          if(data){
            data[option].apply(data,settings);
          }
        });
        return elements;
      }

      return this.each(function() {
        var dlgwin = new dlgWindow(this, settings).init();
        $(this).data('_iDlgWin',dlgwin);
    });
  };

  var dlgWindow = function(elem, options){
      this.elem = elem;
      this.$elem = $(elem);
      this.$mask = null;
      this.$content = null;
      this.needSelectRequire = true;
      this.$title = null;
      this.$btnOk = null;
      this.$btnCancel = null;
      this.btnHeight = _getBtnSize().height;
      this.btnWidth = _getBtnSize().width;
      this.titleHeight = parseInt(getComputedStyle(document.body).lineHeight) + 5;
      this.inputSelection = [];
      this.selectedItems = [];
      this.rowId = null;
      this.fieldIndex = null;
      this.onDrag = false;
      this.contentType = String();
      this.text = String();
      this.limit = null;
      this.options = options;
      this.metadata = this.$elem.data('dlgwin-options');
      this.onmmHandler = Function();
  };

  dlgWindow.prototype = {
    defaults: {
      message: 'Hello world!',
      left: 0,
      top: 0,
      width: 120,
      height: 80,
      idTemplete: "Div",
      contentType: "checklist",//checklist|textbox
      contentText: "",//only for contentType = textbox
      bgColor: "white",
      textColor: "black",
      fontStyleSet: "font-family: Segoe UI;font-size: 12px;",
      title: "Title text",
      titleColor: "#1c0e0e url(images/fhbg.gif) repeat-x bottom",//"#F0F0F0 url(images/fhbg.gif) repeat-x top left",//bg-table-thead
      maskColor: "url(images/mask.png)",
      titleTextColor: "black",
      borderColor: "#dddddd",
      scrollColor: "gray",
      listData: null,
      showOnStart: false,
      isDrag: true,
      isResize: false,
      onSelectedChange: null,
      onButtonClick: null,
      onCancelClick: null,
      onRequireException: null
    },
    init: function() {
      var cid = this.elem.getAttribute('id');
      if(cid){
        try{this.options.idTemplete = cid;}
        catch(e){this.defaults.idTemplete = cid;}
      }
      this.config = $.extend({}, this.defaults, this.options, this.metadata);
      this.contentType = this.config.contentType;
      if(this.config.contentType == "checklist")
        if(this.config.listData && this.config.listData.length > 0){
          this.config.width = _getContentSize(this.config).width + 10;
          this.config.height = _getContentSize(this.config).height + 6 + this.btnHeight + this.titleHeight;
        }
      var x = this.config.left, y = this.config.top,
          h = this.config.height, w = this.config.width;
      var sCSS = _getDefStyle(x,y,w,h,this.config.borderColor);
      sCSS = $.extend(sCSS,{"borderStyle": "outset","borderColor":"#F0F0F0","borderWidth":"1px"});
      sCSS = $.extend(sCSS,{"boxShadow":"rgba(0, 0, 0, 0.2) 2px 2px 0px 0px","zIndex":"2","display":"none","z-index":"100"});
      this.$elem.css(sCSS);
       /*mask*/
      this.$mask = _createDiv(this.config.idTemplete + '_m');
      sCSS = {"left":0, "top":0, "width":0,"height":0};
      sCSS = $.extend(sCSS,{"overflow":"hidden","cursor":"default"});
      sCSS = $.extend(sCSS,{"z-index":"99","background-image":this.config.maskColor});
      this.$mask.css(sCSS);
      $('body').append(this.$mask);
      /*title*/
      var tx = 0, ty = 0
          ,tw = w, th = this.titleHeight;
      this.$title = _createTitle(tx,ty,tw,th,this.config);
      /*button ok*/
      tx = w - this.btnWidth - 2;//2 - отступ справа
      ty = h - this.btnHeight - 2;//2 - отступ снизу
      this.$btnCancel = _createButton(tx,ty,this,1);
      /*button cancel*/
      tx = tx - this.btnWidth - 2;//2 - отступ справа
      ty = ty;//2 - отступ снизу
      this.$btnOk = _createButton(tx,ty,this);
      /*content*/
      tx = 1; ty = this.titleHeight;
      tw = w - 10; th = h - this.titleHeight - (this.btnHeight + 2 + 2) - 2; //2 - отступ кнопки снизу 2 - щтступ кнопки сверху 2 - border/
      this.$content = _createContent(tx,ty,tw,th,this);

      this.$elem.append(this.$title);
      this.$elem.append(this.$btnOk);
      this.$elem.append(this.$btnCancel);
      this.$elem.append(this.$content);
      if(this.config.contentType == "textbox"){
        if (this.config.sizeLinit){
          ty = h - this.btnHeight + 1;
          this.$sizeLimit = _createLimiter(5,ty);
          this.$elem.append(this.$sizeLimit);
          var el = document.getElementById('textbox_c').firstChild,
              output = document.getElementById('Div_l');
          this.limit = new SizeLimit(el,1024),
          this.limit.output = output;
          this.limit.outputText = "${size}/${max}"
        }
      }

      this.$elem.off("changesize").on("changesize",function(e,obj) {
        var h = $(this).height(), w = $(this).width(),
            tw = w - 10, th = h - obj.titleHeight - (obj.btnHeight + 2 + 2) - 2,
            tx = w - obj.btnWidth - 2,//2 - отступ справа
            ty = h - obj.btnHeight - 2;//2 - отступ снизу
        obj.$title.css('width',w);
        obj.$content.css({"height":th,"width":tw});
        obj.$btnOk.css({"left": tx - obj.btnWidth - 2, "top": ty});
        obj.$btnCancel.css({"left": tx, "top": ty});
        return e.preventDefault();
      });
      this.config.showOnStart ? this.dialogShow() : this.dialogHide();
      var $this = this;
      if(this.config.isDrag){
        var xoff, yoff
        ,handler = function(event){
          var ex = event.pageX
              ,ey = event.pageY
              ,elx = parseInt($this.elem.style.left)// $this.$elem.position().left// $(this.parentNode).position().left
              ,ely = parseInt($this.elem.style.top);//$this.$elem.position().top;//$(this.parentNode).position().top;
          xoff = elx - ex;
          yoff = ely - ey;
          $this.onDrag = true;
          return false;
        }
        this.$title[0].onmousedown = handler;
        handler = function(){
          $this.onDrag = false;
        }
        this.$title[0].onmouseup = handler;
        handler = function(event){
          if($this.onDrag){
            $this.elem.style.left = parseInt(event.pageX + xoff) + "px";
            $this.elem.style.top = parseInt(event.pageY + yoff) + "px";
          }
        }
        this.onmmHandler = function(event){
          mx = event.pageX;
          my = event.pageY;
          if($this.onDrag){
            $this.moveTo(mx + xoff,my + yoff);
          }
        }
      }
      return this;
    },
    moveTo: function(x,y){
      this.$elem.css({top: y,left: x});
      return this;
    },
    height: function(val){
      if(arguments.length){
          hMin = this.$elem.height();
          if(this.config.listData){
            hMin = _getContentSize(this.config).height + 6 + this.btnHeight + this.titleHeight;
          }
          th = (val > hMin) ? val : hMin;
          this.$elem.css({"height":th});
          this.$elem.trigger("changesize",[this]);
      }
      else
        return this.$elem.height();
    },
    width: function(val){
      if(arguments.length){
          wMin = this.$elem.width();
          if(this.config.listData){
            wMin = _getContentSize(this.config).width + 10;
          }
          tw = (val > wMin) ? val : wMin;
          this.$elem.css({"width":tw});
          this.$elem.trigger("changesize",[this]);
      }
      else
        return this.$elem.width();
    },
    dialogHide: function(){
      this.$elem.css('display','none');
      this.$mask.css({"height": 0,"width": 0});
    },
    dialogShow: function(x,y){
      var left = this.config.isDrag ? x + "px" : ($(window).width() - this.$elem.width()) / 2 + $(window).scrollLeft() + "px"
          ,top = this.config.isDrag ? y + "px" : ($(window).height() - this.$elem.height()) / 2 + $(window).scrollTop() + "px";
      this.$elem.css({display: '',top: top,left: left})
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
      this.$mask.css({"height": h,"width": w});
      if(this.contentType == 'textbox'&&this.limit)
        this.limit.update();
      this.$content.find('textarea').focus();
    },
    visible: function(){
      return this.$elem.css('display')=='none' ? false : true;
    },
    resizeTo: function(h,w){
      if(arguments.length)
        if(arguments.length > 1){
          hMin = wMin = 80;
          if(this.config.listData){
            wMin = _getContentSize(this.config).width + 10;
            hMin = _getContentSize(this.config).height + 6 + this.btnHeight + this.titleHeight;
          }
          th = (h > hMin) ? h : hMin;
          tw = (w > wMin) ? w : wMin;
          this.$elem.css({"height":th,"width":tw});
          this.$elem.trigger("changesize",[this]);
        }
    },
    addData : function(data,id,field){
        if(this.config.contentType == "checklist"){
          this.selectedItems = data.reduce(function(a,e){return e.value ? a.concat(e.name) : a},[]);
          if(this.selectedItems.length){
            this.inputSelection = this.selectedItems;
            this.text = this.selectedItems.join('; ');
          }
          this.options.listData = data;
        }
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        if(this.config.contentType == "checklist"){
          if(this.config.listData){
            this.config.width = _getContentSize(this.config).width + 10;
            if(this.config.width < this.defaults.width)
              this.config.width = this.defaults.width;
            this.config.height = _getContentSize(this.config).height + 6 + this.btnHeight + this.titleHeight;
            if(this.config.height < this.defaults.height)
              this.config.height = this.defaults.height;
          }
          if(this.$content.children().length > 0)
            this.$content.children().remove();
          this.$elem.css({"height":this.config.height,"width":this.config.width});
          this.$elem.trigger("changesize",[this]);
          this.$content.append(_createListView(this));
          if(arguments.length > 1)
            this.rowId = id;1
          if(arguments.length > 2)
            this.fieldIndex = field;
        }
        else{
          this.$content.find('textarea').text(data);
          this.text = data;
          if(arguments.length > 1)
            this.rowId = id;
          if(arguments.length > 2)
            this.fieldIndex = field;
        }
    },
    getData: function(){
      var res = {};
      if(this.config.listData)
        res = this.config.listData;
      return res;
    },
    delemitedText: function(){
      var resStr = String();
      if(this.contentType == "checklist"){
        if(this.selectedItems.length){
          resStr = this.selectedItems.join("; ");
        }
      }
      else{

      }
      return resStr;
    },
    displayMessage: function() {
      alert(this.config.message);
    }
  };

  /**
   * Private definition
   */
  var _getItemWidth = function(str){
    var res,ts = document.createElement('span');
    ts.setAttribute('id', 'gsize');
    ts.style.position   = 'absolute';
    ts.style.left       = '-100px';
    ts.style.top        = '-100px';
    ts.style.display = 'inline-block';
    ts.style.margin = '0';
    ts.style.padding = '0';
    ts.style.lineHeight   = '100%';
    ts.innerHTML = str;
    document.body.appendChild(ts);
    res = parseInt(ts.getBoundingClientRect().width + 22);//res.width = getComputedStyle(tBtn).width;
    document.body.removeChild(ts);
    return res;
  };
  var _getContentSize = function(config){
    var contentWidth = 0,
        rowCount = config.listData.length,
        contentHeight = 16 * ((rowCount<11) ? rowCount : 10) + 1;
    config.listData.forEach(function(el,i){
      var curW = _getItemWidth(el.name);
      if(curW > contentWidth)contentWidth = curW;
    });
    return {"height":contentHeight,"width":contentWidth + 17};
  };
  var _getBtnSize = function(){
    var res = {},
        tBtn = document.createElement('button');
    tBtn.setAttribute('id', 'gsize');
    tBtn.style.position   = 'absolute';
    tBtn.style.left       = '-100px';
    tBtn.style.top        = '-100px';
    tBtn.style.fontWeight = '800';
    tBtn.style.fontSize   = '8px';
    tBtn.innerHTML = '&#10004';
    document.body.appendChild(tBtn);
    res.height = tBtn.getBoundingClientRect().height;//res.height = getComputedStyle(tBtn).height;
    res.width = tBtn.getBoundingClientRect().width;//res.width = getComputedStyle(tBtn).width;
    document.body.removeChild(tBtn);
    return res;
  };
  var _getDefStyle = function(x,y,w,h,bgc){
    return {"position":"absolute","left":x,"top":y,"width":w,"height":h,"backgroundColor":bgc,"padding": 0,"display": ""};
  };
  var _createDiv = function(cid,bgc) {
    if(arguments.length == 2)
      return $('<div id="' + cid + '"></div>').css({"position":"absolute","padding":0,"backgroundColor":bgc,"display": ""})
    else
      return $('<div id="' + cid + '"></div>').css({"position":"absolute","padding":0,"display": ""});
  };
  var _createLimiter = function(x,y){
    var lim = _createDiv('Div_l');
    lim.css({"left":x, "top":y, "overflow":"hidden","cursor":"default"})
    .attr("name","limit");
    return lim;
  };
  var _createTitle = function(x,y,w,h,config){
    var title = _createDiv(config.idTemplete + '_t',config.titleColor);
    title.css({"left":x, "top":y, "width":w,"height":h,"overflow":"hidden","cursor":"default","background":config.titleColor});
    tx = 5; ty = 2;//caption
    th = parseInt(getComputedStyle(document.body).lineHeight);
    return title.append($('<span style="position:absolute; left:' + tx + 'px; top:' + ty + 'px; height' + th + 'px">' + config.title + '</span>'));
  };//&#10006;
  var _createButton = function(x,y,obj,type){
    var strSelItems = String()
        ,btn,handler;
    if(!type){
      btn = $('<button id="' + obj.config.idTemplete + '_obtn' + '">&#10004</button>');
      handler = function(e) {
        strSelItems = '';
        if(obj.config.contentType == "checklist"){
          if(obj.selectedItems.length){
            strSelItems = obj.selectedItems.join('; ');
            obj.text = strSelItems;
          }
        }
        else{
          strSelItems = obj.$content.children(0).text()
        }
        obj.text = strSelItems;
        if(obj.config.onButtonClick != null){
          obj.config.onButtonClick.apply({"contentType":obj.config.contentType,"rowId":obj.rowId,"text":strSelItems});
        }
        obj.dialogHide();
        obj.selectedItems = [];
        obj.inputSelection = [];
        obj.text = ''
        return e.preventDefault();
      };
    }
    else{
      btn = $('<button id="' + obj.config.idTemplete + '_cbtn' + '">&#10006</button>');
      handler = function(e) {
        strSelItems = '';
        if(obj.config.contentType == "checklist"){
          if(!obj.inputSelection.length){
            obj.selectedItems = [];
            obj.text = '';
          }
          else{
            strSelItems = obj.inputSelection.join('; ');
            obj.text = strSelItems;
          }
        }
        else{
          strSelItems = obj.text;
        }
        if(obj.config.onCancelClick != null){
          obj.config.onCancelClick.apply({"contentType":obj.config.contentType,"rowId":obj.rowId});
        }
        obj.dialogHide();
      }
    }
    btn.off("click").on("click", handler);
    return btn.css({"position": "absolute", "left": x, "top": y, "fontWeight": 800,"fontSize": 8});
  };
  var _createContent = function(x,y,w,h,obj){
    var overflow = (obj.config.contentType=="checklist") ? "scroll" : "none",
        $content = _createDiv(obj.config.idTemplete + '_c',obj.config.bordercolor)
        .css({"left": x, "top": y, "width": w, "height": h, "overflow-y" : overflow})
        .css({"font": obj.config.fontstyleset,"backgroundColor": obj.config.bgColor,"overflow":"hidden"})
        .css({"borderStyle": "inset", "borderColor": "#DDDDDD"})
        .css({"borderWidth": "1px", "padding": "0px 2px 0px 4px"})
        .addClass('dlgwin');
    if(obj.config.contentType == "checklist"){
      if(obj.config.listData && obj.config.listData.length > 0){
        $content.append(_createListView(obj));
      }
    }
    else{
      obj.text = obj.config.contentText;
      $content.append(
        $('<textarea></textarea>')
        .css({"height": "100%"})
        .css({"width": "100%"})
        .css({"overflow-x": "hidden"})
        .css({"overflow-y": "auto"})
        .css({"font-size": "inherit"})
        .css({"font-family": "inherit"})
        .css({"line-height": $content.css('font-size')})
        .css({"border": "0"})
        .css({"word-wrap": "break-word"})
        .attr("name","text")
        .text(obj.config.contentText)
        .off("keypress").on("keydown", function(e){
          var keyCode = e.keyCode;
          if(keyCode == 27){
            obj.dialogHide();
            iEvents.preventDefault(e);
            return false;
          }
        })
      );
    }
    return $content;
  };
  var _createListItem = function(item){
    var strValue = item.name,
        chkValue = item.value == 1 ? true : false;
    var ic= $('<span><a style="cursor:default;" href="#">&nbsp;</a></span>').addClass('itemcheck');
    if(chkValue)ic.addClass('checked');
    var it = $('<span>' + strValue + '</span>').addClass('itemtext');
    var divStyle = 'style="text-align: left; padding: 2px 0px 1px 2px; cursor: default"';
    return $('<tr></tr>')
        .append(
          $('<td></td>')
            .prop('align', 'left')
            .css('display','')
            .append(
              $('<div ' + divStyle + '></div>')
                .append(ic)
                .append(it)
              )
        )
  };
  var _createListView = function(obj){
    var $tBody = $('<tbody></tbody>');
    obj.config.listData.forEach(function(el,i,arr){
      var $curRow = _createListItem(el);
      var handler = function(e) {
        var t = $(this).find('span.itemcheck'),
        nextValue = t.hasClass("checked") ? 0 : 1;
        t.toggleClass("checked");
        obj.config.listData[i].value = nextValue;
        _renderSelection(obj);
        if(obj.config.onSelectedChange != null){
          obj.config.onSelectedChange.apply({"data": obj.config.listData,"index": i});
        }
        return e.preventDefault();
      };
      var target = $curRow.find('span.itemcheck').parent();
      target.off("click.dlgwin").on("click.dlgwin", handler);
      $tBody.append($curRow);
    });
  // var _createListView = function(obj){
  //   var $tBody = $('<tbody></tbody>');
  //   obj.config.listData.forEach(function(el,i,arr){
  //     var $curRow = _createListItem(el);
  //     var handler = function(e) {
  //       var nextValue = $(this).hasClass("checked") ? 0 : 1;
  //       $(this).toggleClass("checked");
  //       var itemName = this.nextSibling.innerHTML;
  //       var itemIndex = _getItemIndex(itemName,obj.config);
  //       obj.config.listData[itemIndex].value = nextValue;
  //       _renderSelection(obj);
  //       if(obj.config.onSelectedChange != null){
  //         obj.config.onSelectedChange.apply({"data": obj.config.listData,"index": itemIndex});
  //       }
  //       return e.preventDefault();
  //     };
  //     var target = $curRow.find('span.itemcheck');//.parent();
  //     target.off("click.dlgwin").on("click.dlgwin", handler);
  //     $tBody.append($curRow);
  //   });
    return $('<table></table>')
            .append($tBody)
              .prop('cellpadding','0')
                .prop('cellspacing','0')
                  .prop('border','0')
                    .prop('unselectable','on')
                      .css({'user-select': 'none'});
  };
  var _getItemIndex = function(itemName,config){
    var index = -1;
    config.listData.forEach(function(el,i){
      if(el.name == itemName)
        index = i;
    });
    return index;
  };
  var _renderSelection = function(obj){
    var tData = obj.config.listData,
        selItems = [];
    tData.forEach(function(el,i){
      if(el.value == 1)
        selItems.push(el.name);
    });
    obj.selectedItems = [];
    obj.text = selItems.join('; ')
    obj.selectedItems = selItems;
  };

  dlgWindow.defaults = dlgWindow.prototype.defaults;

  window.dlgWindow = dlgWindow;
})(window, jQuery);