var images = [];
function preloadImg(){
  var l = images.length;
  for (var i=0; i<arguments.length; i++){
    images[l+i] = new Image();
    images[l+i].src = arguments[i];
  }
}
preloadImg('images/find-off.png','images/find-on.png','images/find-over.png');
preloadImg('images/hide-opaque.png','images/hide-opaque.png','images/hide-opaque.png');
preloadImg('images/next-off.png','images/next-on.png','images/next-over.png');
preloadImg('images/prev-off.png','images/prev-on.png','images/prev-over.png');

var ISearchPanel = function(win){
  var global = win;
  function ISearchPanel(settings){
    var options = _extend({}, defaults, settings);
    options.id = 'ISearchPanel' + ISearchPanel.count;
    options.control = 'SearchPanel';
    icgControl.call(this, options);
    this.observation = true;
    this.SetLinkedTable(options.source);
    this.hide();
    this.handlers = {};
    this.name = 'SearchPanel' + (ISearchPanel.count++);
    this.left = options.left;
    this.top = 16;
    this.height = options.height;
    this.width = options.parent.width - 2;
    this.css.cursor = 'default';
    Object.defineProperty(this, 'active', {
      get: function() {
        if(this.css.visibility == 'hidden')
          return false
        else return true;
      }
    });
    this.onHideBtnClick = hideClick;
    this.onNextBtnClick = nextClick;
    this.onPrevBtnClick = prevClick;
    this.onFindBtnClick = findClick;
    this.Build();
  }
  ISearchPanel.prototype = Object.create(icgControl.prototype);
  ISearchPanel.prototype.constructor = ISearchPanel;
  ISearchPanel.prototype.addHandler = function(type, handler){
    if (typeof this.handlers[type] == "undefined"){
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  };
  ISearchPanel.prototype.fire = function(event){
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
  ISearchPanel.prototype.removeHandler = function(type, handler){
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
  ISearchPanel.prototype.Build = function(){
    var panel = this;
    panel.css.borderLeft = '1px solid #cdcdcd';
    panel.css.borderRight = '1px solid #cdcdcd';
    /**********************  Кнопка "Скрыть панель поиска"  **********************/
    // this.hideButton = new icgButtonImage({parent:this,id: this.id + 'hideButton',left: 1,top: 5,width: 14,height: 14});
    // this.hideButton.setImages(images[3].src, images[4].src, images[5].src).build();
    // this.hideButton.elm.style.border = '1px solid #F0F0F0';
    // this.hideButton.elm.style.backgroundColor = '#F0F0F0';
    // var hBtn = this.hideButton;
    // this.hideButton.elm.onOver = function(e){
    //   this.style.border = '1px solid #E8EFF7';
    //   this.style.backgroundColor = '#A4CEF9';
    // }
    // this.hideButton.elm.onDown = function(e){
    //   this.style.border = '1px solid #62A2E4';
    //   this.style.backgroundColor = '#C9E0F7';
    // }
    // this.hideButton.elm.onOut = function(e){
    //   this.style.border = '1px solid #F0F0F0';
    //   this.style.backgroundColor = '#F0F0F0';
    // }
    // this.hideButton.activate();
    // this.hideButton.onClick = new Function(this.obj + '.onHideBtnClick(); return false;');
    //обработчик события изменение размеров основного контейнера
    this.fieldTitle =  new icgLabel({id: this.id + 'Title',parent: this,left: 5,
      top: 6,width: 31,caption: 'Пошук:',backgroudColor: 'inherit',font: '10px/12px Segoe UI',zIndex: 1
    });
    /**********************  Кнопка "Предыдущее"  **********************/
    this.nextButton = new icgButtonImage({parent:this,id: this.id + 'nextButton',left: panel.width - 17,top: 9,width: 12,height: 12});
    this.nextButton.setImages(images[6].src, images[7].src, images[8].src).build().activate();
    this.nextButton.onClick = new Function(this.obj + '.onNextBtnClick(); return false;');
    //обработчик события изменение размеров основного контейнера
    this.nextButton.onParentResize = function(){
      this.left = panel.width - 17;
    }
    //подписываемся на изменение размера основного контейнера
    this.addSubscriber(this.nextButton.dispath);
    /**********************  Кнопка "Следующее"  **********************/
    var nextButton = this.nextButton;
    this.prevButton = new icgButtonImage({parent:this,id: this.id + 'prevButton',left: nextButton.left - 17,top: 9,width: 12,height: 12});
    this.prevButton.setImages(images[9].src, images[10].src, images[11].src).build().activate();
    this.prevButton.onClick = new Function(this.obj + '.onPrevBtnClick(); return false;');
    //обработчик события изменение размеров основного контейнера
    this.prevButton.onParentResize = function(){
      this.left = nextButton.left - 17;
    }
    //подписываемся на изменение размера основного контейнера
    this.addSubscriber(this.prevButton.dispath);
    /**********************  Счетчик вхождений  **********************/
    this.matchesCounter =  new icgLabel({id: this.id + 'Counter',parent: this,left: this.prevButton.left - 73,
      top: 6,width: 71,caption: '',backgroudColor: 'inherit',font: '10px/12px Segoe UI',zIndex: 1
    });
    this.matchesCounter.autosize = false;
    this.matchesCounter.caption = '';
    this.matchesCounter.width = 75;
    this.matchesCounter.align = 'center';
    var prevButton = this.prevButton,
        them = this;
    //обработчик события изменение размеров основного контейнера
    this.matchesCounter.onParentResize = function(){
      this.left = prevButton.left - 75;
    }
    //подписываемся на изменение размера основного контейнера
    this.addSubscriber(this.matchesCounter.dispath);
    /**********************  Конпка "Поиск"  **********************/
    this.findButton = new icgButtonImage({parent:this,id: this.id + 'FindButton',
      left: this.matchesCounter.left - 17,top: 6,width: 16,height: 16
    });
    this.findButton.setImages(images[0].src, images[1].src, images[2].src).build().activate();
    this.findButton.visible = true;
    this.findButton.onClick = new Function(this.obj + '.onFindBtnClick(); return false;');
    var matchesCounter = this.matchesCounter;
    //обработчик события изменение размеров основного контейнера
    this.findButton.onParentResize = function(){
      this.left = matchesCounter.left - 17;
    }
    //подписываемся на изменение размера основного контейнера
    this.addSubscriber(this.findButton.dispath);
    /**********************  Поле ввода  **********************/
    this.searchField = new ISearchField({parent:this,id:this.id + 'SearchField',left:51 ,top:3,width:this.findButton.left - 60});
    this.searchField.indentRight = this.findButton.left - 10;
    this.searchField.width = this.searchField.indentRight;
    var findButton = this.findButton,
        sField = this.searchField;
    //обработчик события изменение размеров основного контейнера
    this.searchField.onParentResize = function(){
      sField.width = findButton.left - 60;
      sField.editField.style.width = (this.width - this.indent - 3) + 'px';
    }
    //подписываемся на изменение размера основного контейнера
    this.addSubscriber(this.searchField.dispath);

    this.searchPoints = [];
    this.Bookmarks = MarkerPoints;
    this.state = undefined;
    /*Добавляем события*/
    this.addHandler('onSearchInit',_onSearchInit);
    this.nextButton.visible = false;
    this.prevButton.visible = false;
    this.findButton.visible = false;
    //Обработчик отдельно для клавиши ENTER
    iEvents.addHandler(window, "keypress", function(e){
      var keyCode = e.keyCode;
      if(e.target && e.target.id && e.target.id.includes('SearchField')){
          if(keyCode == 13)
            if(panel.searchPoints.length > 0)
              panel.Bookmarks.next();
      }
    });
    //Обработка нажатия клавиш ВВЕРХ/ВНИЗ если источник события BODY!!!
    iEvents.addHandler(window, "keydown", function(e){
      var keyCode = e.keyCode;
      if(keyCode == 40){
        if(e.target.tagName == 'BODY'){
          if(panel.searchPoints.length > 0)
            panel.Bookmarks.next();
        }
      }
      if(keyCode == 38){
        if(e.target.tagName == 'BODY'){
          if(panel.searchPoints.length > 0)
            panel.Bookmarks.prev();
        }
      }
      if(e.ctrlKey && e.keyCode == 70){
        if(!panel.active&&panel.grid.treeView.nodes.length)
          panel.show();
        iEvents.preventDefault(e);
        return false;
      }
    });
  };
  ISearchPanel.prototype.searchClear = function(){
    if(this.searchPoints.length)
      this.searchPoints = [];
    this.Bookmarks.clear;
    this.state = 'ready';
    this.matchesCounter.caption = '';
    this.nextButton.visible = false;
    this.prevButton.visible = false;
    return this;
  };
  ISearchPanel.prototype.onEnterText = function(arg){
    //Обработчик события "Поиск", нажатие клавиши Enter в поле ввода,
    recFound = alasql('select * from ? where lower(ItemName) like \'%' + arg.value + '%\' order by RowID',[this.grid.dataSet]), //dataModule.SQL('where lower(ItemName) like \'%' + arg.value + '%\' order by RowID', 'ID'),
    recCount = recFound ? recFound.length : undefined;
    if(recCount){
      this.searchClear().textRange = document.body.createTextRange();
      this.textRange.moveToElementText(this.grid.dataElement.querySelector('tbody'));
      while (this.textRange.findText(arg.value)) {
          if(this.textRange.parentElement().classList.contains('search-field')){
              var parentNode = this.textRange.parentElement().parentNode;
              while(parentNode.nodeName!='TR')
                parentNode= parentNode.parentNode;
              var id = parentNode.dataset.rowId;
              this.searchPoints.push({RowID:id,Range:this.textRange.getBookmark()});
          }
          this.textRange.collapse(false);
      }
      if(this.searchPoints.length){
        this.Bookmarks.init(this,this.searchPoints);
        this.nextButton.visible = true;
        this.prevButton.visible = true;
        this.fire({type: "onSearchInit", target:this});
      }
    }
    else
      this.searchClear();
  };
  ISearchPanel.prototype.onClearText = function(event){
    this.searchClear();
  }
  ISearchPanel.prototype.onStep = function(event){
    var arr = [],
        row = this.grid.treeView.tree[parseInt(event.bookmark.RowID)],
        pID = row.parentId,
        B = this.searchPoints.length,
        A = this.Bookmarks.currentIndex();
    arr.push(event.bookmark.RowID);
    if(pID){
      arr.push(pID);
      if(this.grid.treeView.tree[pID].parentId)
        arr.push(this.grid.treeView.tree[pID].parentId);
    }
    while(arr.length > 0)
      this.grid.treeView.tree[arr.pop()].expand();
    this.matchesCounter.caption = sprintf('(%0:s : %1:s)',A+1,B);
    this.textRange.moveToBookmark(event.bookmark.Range);
    this.textRange.select();
    this.textRange.scrollIntoView();
    this.grid.fire({type:'onSetActiveRow',rowIndex:this.grid.treeView.tree[parseInt(event.bookmark.RowID)].row.rowIndex});
    return this;
  }
  ISearchPanel.prototype.SetLinkedTable = function(grid){
    if(grid && isInstance(grid,iTreeGrid))
      this.grid = grid;
    return this;
  };
  ISearchPanel.prototype.show = function() {
      this.css.visibility = 'visible';
      this.elm.classList.remove('visuallyhidden');
      if(this.grid){
        var myTop = this.top,
            grid = document.getElementsByClassName('grid-data')[0],
            gridHeight = parseInt(grid.style.height);
        this.grid.top = 50;
        grid.style.height = (gridHeight - 34) + 'px';
      }
      return this;
  };
  ISearchPanel.prototype.hide = function() {
      if(this.grid){
        var myTop = this.top,
            grid = document.getElementsByClassName('grid-data')[0],
            gridHeight = parseInt(grid.style.height);
        this.grid.top = 16;
        grid.style.height = (gridHeight + 34) + 'px';
      }
      this.css.visibility = 'hidden';
      this.elm.classList.add('visuallyhidden');
      return this;
  };
  function findClick(){
    //обработка события нажатия кнопки "Поиск"
    var tStr = this.searchField.value;
    //длина шаблона поиска не менне 3-символов без крайних пробелов
    if(tStr.trim().length > 2){
      this.onEnterText({observer: this.findButton, value:this.searchField.value});
    }
  };
  function hideClick(){
    //обработка события нажатия кнопки "Далее"
    this.searchClear();
    return this;
  };
  function nextClick(){
    //обработка события нажатия кнопки "Далее"
    if(this.state == 'search')
      this.Bookmarks.next();
    return this;
  };
  function prevClick(){
    //обработка события нажатия кнопки "Назад"
    if(this.state == 'search')
      this.Bookmarks.prev();
    return this;
  };
  function _onSearchInit(event){
    var A = 0,
        B = event.target.searchPoints.length;
    event.target.matchesCounter.caption = sprintf('(%0:s : %1:s)',A,B);
    event.target.state='search';
  }

  var defaults = {
      left   : 0,
      top: 0,
      height: 29
  };
  ISearchPanel.count = 0;
  return ISearchPanel;

}(window);

var MarkerPoints = (function(){
  var index = -1,
      data = [],
      length = data.length,
      direction = 0,
      dispatcher = undefined;
  return{
      next: function(){
        if(direction==0) index = 0
        else index++;
        if(index==length) index = 0;
        direction = 1;
        this.publish({type:'Step',observer: this, bookmark:data[index]});
      },
      prev: function(){
        if(direction==0) index = length - 1
        else index--;
        if(index<0) index = length - 1;
        direction = -1;
        this.publish({type:'Step',observer: this, bookmark:data[index]});
      },
      clear: function(){
        data = [];
      },
      currentIndex: function(){
        return index;
      },
      init: function(){
        var owner = arguments[0],
            points = arguments[1];
        data = [];
        for (var i=0;i<points.length;i++) {
          data.push(points[i]);
        }
        length = data.length;
        direction = 0;
        index = -1;
        if(!dispatcher){
          dispatcher = iObserver;
          dispatcher.make(this);
          this.addSubscriber(owner.dispath);
        }
      }
  }
}());