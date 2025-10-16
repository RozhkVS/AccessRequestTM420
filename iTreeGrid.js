admUI = window.external.Form.View.Component;
var btnEvent;
var cbsNone = 0,
	cbsEllipsis = 1,
	cbsLink = 2;
var iTreeGrid = function(win) {
	var global = win;
    /**
     * [iTreeGrid [Базовый объект интерфейса пользователя]
     * @param  {[arguments]} settings [Объект именнованных свойств]
     * @return {[Object]} iTreeGrid [Ссылка на созданный объект]]
     */
  	function iTreeGrid(settings) {
      	var _rootFilter = [],
      		_left = settings.left || 0,
            _top = settings.top || 0,
            _height = settings.height || 0,
            _width  = settings.width || 0,
            _visible = false,
            _initialization = true,
            _activeRow = undefined,
            _id = settings.id || 'iTreeGrid' + (iTreeGrid.count++),
            _columns = [],
            _viewMode = undefined,
            _CM = defColumnsModel,
            _DataSet= undefined,
            _parent = settings.parent || document.body,
            _callback = settings.callback || undefined,
            _filtered = false,
            _userColumnsModel = _createColumnsModel(settings.columnModel);
		Object.defineProperty(this, 'id', {
            get: function() {
                return _id;
            }
        });
		Object.defineProperty(this, 'parent', {
            get: function() {
                return _parent;
            }
        });
        Object.defineProperty(this, 'userColumnsModel', {
            get: function() {
            	return _userColumnsModel;
            }
        });
        Object.defineProperty(this, 'fixedColumnsWidth', {
            get: function() {
            	return _userColumnsModel.filter(function(elm){return elm.size.includes('px')}).reduce(function(s,elm){return s+elm.width},0);
            }
        });
        Object.defineProperty(this, 'fixedColumnsCount', {
            get: function() {
            	return _userColumnsModel.filter(function(elm){return elm.size.includes('px')}).length;
            }
        });
        Object.defineProperty(this, 'rootFilter', {
            get: function() {
                return _rootFilter;
            },
            set: function(val) {
            	if(isInstance(val, Array)&&val.length)
	                _rootFilter = val;
            }
        });
        //инициализация св-ва ColumnsModel (readonly)
		//Дозополняем стандартную часть модели СМ
		_userColumnsModel.forEach(function(columnDef){
			_CM.push(columnDef)//определенными пользователем столбцамиЫ
		});
        /* Позиционные Метрики (read/write) */
        Object.defineProperty(this, 'left', {
            get: function() {
                return _left;
            },
            set: function(val) {
                _left = parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.left = _left + 'px';
            }
        });
        Object.defineProperty(this, 'top', {
            get: function() {
                return _top;
            },
            set: function(val) {
                _top = parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.top = _top + 'px';
            }
        });
        Object.defineProperty(this, 'height', {
            get: function() {
                return _height;
            },
            set: function(val) {
                _height = parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.height = _height + 'px';
            }
        });
        Object.defineProperty(this, 'width', {
            get: function() {
                return _width;
            },
            set: function(val) {
                _width = parseInt(val.toString().replace(/px+$/, ""));
                this.elm.style.width = _width + 'px';
            }
        });
        Object.defineProperty(this, 'dataSet', {
            get: function() {
                return _DataSet;
            },
            set: function(data) {
                _DataSet = data;
            }
        });
        Object.defineProperty(this,'initialize', {
        	get: function() {
                return !_initialization;
            }
        });
        Object.defineProperty(this, 'CM', {
            get: function() {
                return _CM;
            }
        });
        Object.defineProperty(this, 'columnsCount', {
            get: function() {
                return _userColumnsModel.length;
            }
        });
        Object.defineProperty(this, 'activeRow', {
            get: function() {
                return _activeRow;
            }
        });
        Object.defineProperty(this, 'viewMode', {
            get: function() {
                return _viewMode;
            },
            set: function(val){
            	if(_viewMode == undefined)
            		_viewMode = val;
            }
        });
        this.handlers = {};
        this.selectedRows = [];
		this.headerElement = undefined;
		this.dataElement = undefined;
		this.treeGrid = undefined;
		this.table = undefined;
		this.treeView = new Tree(this);
		this.selectedItems = [];
		this.needToAsyncLoad = [];
        var that = this;
		this.RefreshData = function(){
			_DataSet = this.InitFunction.call(this);
			return this;
		}
        /*
         внутренние обработчики собыимй
        */
        //пользовательский onSelectedChange
        var _onItemSelect = _callback;
        //Событие инициализации представления иерархии, настроено происходить
        //после загрузки первого root-узла (ИС), установив на нем selected,
        //в background происходит ассинхронная "догрузка" данных узлов верхнего
        //уровня с исключением из требующих подргрузки
        var _onInit = function(){
        	_initialization = false;
        	that.removeHandler('onInit',_onInit);
        	if(that.viewMode == 1)
        		that.fire({type: "onSetActiveRow", rowIndex: 0});
        };
        var _onSetActiveRow = function(event){
        	var oldActiveRowIndex = _activeRow ? _activeRow.rowIndex : -1,
        		rowIndex = parseInt(event.rowIndex);
        	if(event&&(event.type=='onSetActiveRow')){
        		rowIndex =parseInt(event.rowIndex);
        		if((rowIndex!=NaN)&&(rowIndex>=0)){
        			if(oldActiveRowIndex!=rowIndex){
        				if(_activeRow){
        					if(that.viewMode == 1)
        						_activeRow.classList.toggle('selected');
        				}
       					_activeRow = that.table.rows[rowIndex];
       					if(that.viewMode == 1)
       						_activeRow.classList.toggle('selected');
        			}
        		}
        	}
        	var rowID = that.table.rows[rowIndex].dataset.rowId,
        		node = that.treeView.tree[rowID],
        		br = ('systemgroup'.includes(node.row.dataset.itemType)) ? true : false,
        		re = (node.row.dataset.itemType=='system') ? false : true,
        		reveal = false;
        	if(re){
        		if(!node.parentNode().expanded()){
        			node.reveal();
        			reveal = true;
        		}
        	}
        	if(br&&!reveal)that.fire({type: "onBranchStateChenge", rowIndex: rowIndex});
   			that.fire({type:'onItemSelect',grid:that});
   			return that;
        };
        var _onBranchStateChenge = function(event){
        	var row = that.table.rows[event.rowIndex],
        		rowID = row.dataset.rowId;
			if(row.classList.contains('collapsed'))//тут показать
				that.expand(rowID);
			else //тут скрыть
				that.collapse(rowID);
        };
        var _onSelectedChange = function(event){
        	if(that.viewMode == 2){
        		if(event.check)that.selectedItems.push(parseInt(event.row.dataset.rowId));
        		else{
        			var index = that.selectedItems.indexOf(parseInt(event.row.dataset.rowId));
        			if(index>=0)
        				that.selectedItems.splice(index,1);
        		}
        	}
        	if(that.SelectedChange)
       			that.SelectedChange(event);
        };
        var _onCellButtonClick = function(event){
        	if(that.CellButtonClick)
        		that.CellButtonClick(event);
        };
        var _onChangeValue = function(event){
        	if(that.CellValueChange)
        		that.CellValueChange(event);
        };
        //инициализируем события и привязываем обработчики
        this.addHandler('onInit',_onInit);
        this.addHandler('onSetActiveRow',_onSetActiveRow);
        this.addHandler('onItemSelect',_onItemSelect);
        this.addHandler('onSelectedChange',_onSelectedChange);
        this.addHandler('onBranchStateChenge',_onBranchStateChenge);
        this.addHandler('onCellButtonClick',_onCellButtonClick);
        this.addHandler('onChangeValue',_onChangeValue);
        //
        //определение public методов, реализующих доступ к свойствам столбцов
        this.getColumn = function(indx){
        		return _columns[indx - 5];
        };
        this.setColumn = function(col){
    		if(_initialization)
    			_columns[_columns.length] = col;
        }
        //строим макет
        this.Create();
	};

	inherit(iTreeGrid,EventTarget);
	iTreeGrid.prototype.InitFunction = new Function();
	iTreeGrid.prototype.SelectedChange = new Function();
	iTreeGrid.prototype.CellButtonClick = new Function();
	iTreeGrid.prototype.RowDataBuilder = new Function();
	iTreeGrid.prototype.CellValueChange = new Function();
	iTreeGrid.prototype.FieldByName = function(fieldName){
		var cells = this.activeRow.cells,
			 len = this.activeRow.cells.length;
	}
	iTreeGrid.prototype.asyncLoad = function(data,menuObject){
		var that = this,needToLoad,syncTimeID,t1,t2;
		if(!needToLoad)
			needToLoad = data.reverse();
		syncTimeID = setInterval(function(){
          var ones=false;
          if(!t1){/*убрать после релиза*/
            t1 = new Date();
            ones = true;
          }/*убрать после релиза*/
          var cur = needToLoad.length ? needToLoad.pop() : undefined;
          if(cur){
            that.loadChildrenRows(cur);//передавать в качестве callback
            if(ones){
              menuObject.fire({type:'onInit'});//<<<<< /*нужно как-то передавать ссылку на меня или что-то в этом роде универсальное*/
              that.fire({type:'onInit'});
              ones = false
            }
          }
          else{
            clearInterval(syncTimeID);
            t2 = new Date();/*убрать после релиза*/
            document.trace('Сбросили интервал проверки (сек):' + dateDiff(t1,t2,JST_FIELD_SECOND));/*убрать после релиза*/
          }
        },10);
	};
	iTreeGrid.prototype.Init = function(options){
		var DM,rootFilter,viewMode,preSelect,qStr,tStr,grid = this;
		if(options){
			rootFilter = options.rootFilter || undefined;
			this.viewMode = options.viewMode || 1;
			this.preSelect = options.preSelect || undefined;
		}
		else
			this.viewMode = 1;
		if(rootFilter&&isInstance(rootFilter, Array)&&rootFilter.length){
			this.rootFilter = rootFilter;
		}
		if(!this.rootFilter.length){
			qStr = "select * from ? where Level = 0 order by PathStr";
			tStr = "select distinct ParentID from ? where ItemType<>'system' and Level = 1";
			sys = alasql(tStr,[this.dataSet]);
			// document.trace( JSON.stringify(sys) );
		}
		else
			qStr = "select * from ? where Level = 0 and ID in (" + this.rootFilter.toString() + ") order by PathStr";
		if(this.dataSet){
			alasql(qStr,[this.dataSet],function(data){
				var roots = [],g = grid;
				data.forEach(function(dataRow){
					g.needToAsyncLoad.push(dataRow.ID);
					g.addRow(dataRow);
				});
			});
		}
		return this;
	};
	iTreeGrid.prototype.Create = function(){
		if (!this.CM.length || this.CM.length <= 5)return;
		var _zi = 0,_componentTempalte = this.createColumns(),grid = this;
		if(this.parent && this.parent.style)_zi = this.parent.style.zIndex
		else if(this.parent.css)_zi = this.parent.css.zIndex;
		this.elm = (this.parent instanceof icgControl) ? this.parent.elm.appendChild(_componentTempalte) : this.parent.appendChild(_componentTempalte);
		this.elm.style.zIndex = _zi + 1;
		this.elm.style.position = "absolute";
		if(this.parent)
			if(this.parent instanceof icgControl)
				this.parent.AddChild(this);
		this.Redraw();
		this.Rz = resizilla;
		this.Rz(function(){grid.Redraw()}, 100);
		return this;
	};
  	iTreeGrid.prototype.createColumns = function(){
		var grid = this;
		var setTableElement = function(domElm){
			if(domElm.classList.contains('tree-grid')){
				grid.treeGrid = domElm;
				return;
			}
			if(domElm.classList.contains('grid-header')){
				grid.headerElement = domElm;
				return;
			}
			if(domElm.classList.contains('grid-data')){
				grid.dataElement = domElm;
				return;
			}
		}
		var CM = this.CM, sumWidth = 0, fragment, colDef,
			gridStyle = ''.concat('top: ',this.top,'px;','left: ',this.left,'px;');
		treeGrid = _extend(treeGrid,{id: this.id,cssString:gridStyle});
		gridHeader = _extend(gridHeader,{id: this.id + 'Header'});
		gridData = _extend(gridData,{id: this.id + 'Data'});
		fragment = renderElement.call(this,treeGrid,setTableElement);
		for(var i=5;i<CM.length;i++){
			colDef = _extend(CM[i],{index: i, grid: this})
			this.setColumn(new ICustomColumn(colDef));
			sumWidth += (CM[i].width);
		}
		this.headerElement.getElementsByTagName('table')[0].style.width = sumWidth + 2 + 15 + 'px';
		this.table = this.dataElement.getElementsByTagName('table')[0];
		this.table.style.width = sumWidth  + 'px';
		return fragment;
	};
	iTreeGrid.prototype.createRow = function(rowData,rowIndex){
		var className,
			leaf = (rowData.ItemType=='component') ? true : false,
			row = this.table.insertRow(rowIndex);
		row.setAttribute('data-row-id',rowData.ID);
		row.setAttribute('data-parent-id',rowData.ParentID ? rowData.ParentID : 0);
		row.setAttribute('data-item-type',rowData.ItemType);
		row.setAttribute('data-item-level',rowData.Level);
		if('component'.indexOf(rowData.ItemType) < 0){
			className = 'branch collapsed';
			if(rowData.ItemType == 'group')row.style.display = 'none';
		}
		else{
			if(this.viewMode == 2)className = 'leaf uncheck'
			else className = 'leaf';
			row.style.display = 'none';
		}
		row.className = className;
		if('Заблоковано'.indexOf(rowData.Status) >= 0) row.classList.add('blocked');
		this.treeView.addRow(row);
		if(this.RowDataBuilder&&leaf){
			this.treeView.tree[rowData.ID].data = this.RowDataBuilder(rowData,this.dataSet);
		}
		return row;
	};
	iTreeGrid.prototype.addRow = function(rowData,rowIndex){
		var grid = this,
			index = rowIndex ? rowIndex : ((rowIndex == 0) ? 0 : -1),
			row = this.createRow(rowData,index),
			rowID = rowData.ID,
			branch = ('component'.indexOf(rowData.ItemType) < 0) ? true : false;
		var onCellClick = function(event){
			var node = grid.treeView.tree[rowID],
				itemType = node.row.dataset.itemType,
				cellIndex = event.currentTarget.cellIndex,
				tagName = event.target.tagName;
			if((cellIndex==0)&&(itemType=='component')){
				if(grid.viewMode == 2){
					var currState;
					if(tagName!='INPUT'){
						currState = node.row.cells[0].firstChild.firstChild.checked;
						node.row.cells[0].firstChild.firstChild.checked = !currState;
						grid.fire({type:'onSelectedChange',row:event.currentTarget.parentNode,check:!currState});
					}
					else{
						currState = node.row.cells[0].firstChild.firstChild.checked;
						grid.fire({type:'onSelectedChange',row:event.currentTarget.parentNode,check:currState});
					}
				}
			}
			grid.fire({type:'onSetActiveRow',rowIndex:event.currentTarget.parentNode.rowIndex});
		};
		var onCheckChange = function(e){
			var node = grid.treeView.tree[rowID],
				check = e.target.checked;//uncheck
			if(check){
				if(node.row.classList.contains('uncheck'))
					node.row.classList.replace('uncheck','check')
				else node.row.classList.add('check');
			}
			else {
				if(node.row.classList.contains('check'))
					node.row.classList.replace('check','uncheck')
				else node.row.classList.add('uncheck');
			}
		};
		var onButtonClick = function(event){
			var fieldIndex = event.target.parentNode.parentNode.parentNode.cellIndex;
			event.preventDefault();
			if(event.target.tagName == 'INPUT'){
				grid.fire({type:'onChangeValue',buttonStyle:col.ButtonStyle,row:row,fieldIndex:fieldIndex,value:event.target.checked});
			}
			if(event.target.tagName == 'IMG'){
				// document.trace('fieldIndex: ' + fieldIndex);
				grid.fire({type:'onCellButtonClick',buttonStyle:'ellipsis',row:row,fieldIndex:fieldIndex});
			}
			if(event.target.tagName == 'A'){
				grid.fire({type:'onCellButtonClick',buttonStyle:'link',row:row,fieldIndex:fieldIndex});
				return false;
			}
		}
		for(var i=0;i<this.columnsCount;i++){
			var col = this.getColumn(defColumnsModel.length - this.columnsCount + i),
				params = {column:col,rowData:rowData,viewMode:this.viewMode,cellClickHandler:onCellClick,cellEventHandler:onButtonClick,rowCheckHandler:onCheckChange};
			renderElement(createFieldDefinition(params),row);
		}
		return row;
	};
	iTreeGrid.prototype.Redraw = function(){
		var parentElm = this.elm.parentNode,
			viewWidth = parseInt(parentElm.style.width) - 2,
			fixedColWidth = this.fixedColumnsWidth,
			resizebleColumns = [],
			treeGridWidth = viewWidth - this.left*2,
			treeGridIW = treeGridWidth - 17,
			that = this;
		this.elm.style.width = treeGridWidth + 'px';
		jQuery('.grid-data table').width(jQuery('.grid-data').parent().width()-19);
		this.userColumnsModel.forEach(function(elm,index,arr){
			var colIndex = index + 5
			tgW = treeGridIW;
			if(index==arr.length-1){
				var s=0;
				for(var i=0,len=index;i<len;i++){
					if(!arr[i].size.includes("px")){
						s = s + Math.floor((tgW-fixedColWidth)/100*parseInt(arr[i].size)-1);
					}
					else{
						s = s+ (parseInt(arr[i].size )-1);
					}
				} 
				that.setColumnWidth(colIndex,tgW-s-2);
			}
			else{
				if(elm.size.includes("%")){
					that.setColumnWidth(colIndex,Math.floor((tgW-fixedColWidth)/100*parseInt(elm.size)-1));
				}
				else{
					that.setColumnWidth(colIndex,parseInt(elm.size)-1);
				}
			}
		});
		this.dataElement.style.height = window.innerHeight - this.dataElement.getBoundingClientRect().top - 6 + "px";
	};
	iTreeGrid.prototype.loadChildrenRows = function(id){
		var grid = this,
			row = this.table.querySelector("tr[data-row-id='" + id + "']"),
			nextSiblingRowIndex = this.table.querySelector("tr[data-row-id='" + id + "']").rowIndex + 1,
			DM = alasql('select * from ? where ParentID = ' + id + ' order by PathStr desc',[grid.dataSet]);
		if(DM && DM.length){
			DM.forEach(function(dataRow){
				grid.addRow(dataRow,nextSiblingRowIndex);
				if(dataRow.ItemType == 'group'){
					grid.loadChildrenRows(parseInt(dataRow.ID));
				}
			});
		}
	};
	iTreeGrid.prototype.setColumnWidth = function(col,w){
			this.getColumn(col).size = w;
	};
	iTreeGrid.prototype.expandAll = function(){
		this.treeView.expandAll();
	};
	iTreeGrid.prototype.collapseAll = function(){
		this.treeView.collapseAll();
	};
	iTreeGrid.prototype.expand = function(id){
		this.treeView.tree[id].expand();
	};
	iTreeGrid.prototype.collapse = function(id){
		this.treeView.tree[id].collapse();
	};
	iTreeGrid.prototype.setActiveRow = function(id){
		var item = id ? this.treeView.tree[id] : undefined;
		if(!item) return this.activeRow;
		if(this.treeView.tree[id].hasChildren())
			this.treeView.tree[id].row.querySelectorAll('span')[0].classList.add('grid-indenter')
		else
			this.treeView.tree[id].row.querySelectorAll('span')[0].classList.remove('grid-indenter');
		this.fire({type: "onSetActiveRow", rowIndex: this.treeView.tree[id].row.rowIndex});
		return this;
	};
	iTreeGrid.prototype.setPreselectData = function(rowID,cellValues){
		var row = this.treeView.tree[rowID].row,
			rowIndex = row.rowIndex,
			valCount = cellValues.length;
		if(valCount){
			for(var i=0;i<valCount;i++){
				var index = cellValues[i].index,
					value = cellValues[i].value;
				if(value.includes('</'))
					row.cells[index].querySelector('span').innerHTML = value
				else row.cells[index].querySelector('span').innerText = value;
			}
		}
		if(this.viewMode == 2){
			row.cells[0].firstChild.firstChild.checked = true;
			this.selectedItems.push(rowID);
		}
	};
	iTreeGrid.prototype.rootItemLoad = function(rootId){
		var that = this,rowIndex = -1,
			qStr = "SELECT * FROM ? where ID = " + rootId + " order by PathStr";
     	var	query = alasql(qStr,[this.dataSet]);
     	var item = query[0];
     	var	curRoots = this.treeView.roots.length ? this.treeView.roots.map(function(el){return parseInt(el.id);}) : [];
     	var	nextRootID = curRoots.length ? _getNextRootId(curRoots,rootId) : 0;
     	if(nextRootID&&(nextRootID>=0))
     		rowIndex = nextRootID ? this.treeView.tree[nextRootID].row.rowIndex : -1
     	this.addRow(item,rowIndex);
		this.loadChildrenRows(rootId);
		if(this.treeView.tree[rootId].hasChildren())
			this.treeView.tree[rootId].row.querySelectorAll('span')[0].classList.add('grid-indenter')
		else
			this.treeView.tree[rootId].row.querySelectorAll('span')[0].classList.remove('grid-indenter');
		return this;
	};
	iTreeGrid.prototype.rootItemUnload = function(rootId){
		var rowIndex,id,item,level,nodeIndex,that = this,
		    curRootsID = this.treeView.roots.map(function(el){return parseInt(el.id);}),
			qStr = "SELECT * FROM ? where PathStr like '%" + rootId + "%' order by PathStr desc",
     		forDel = alasql(qStr,[this.dataSet]);
		if(forDel.length){
			forDel.forEach(function(dataRow){
				id = dataRow.ID;
				level = dataRow.Level;
				item = that.treeView.tree[id];
				rowIndex = that.treeView.tree[id].row.rowIndex;
				that.table.deleteRow(rowIndex);
				delete that.treeView.tree[id];
				nodeIndex = that.treeView.nodes.indexOf(item);
				that.treeView.nodes.splice(nodeIndex, 1);
				if(!level){
					nodeIndex = that.treeView.roots.indexOf(item);
					that.treeView.roots.splice(nodeIndex, 1);
				}
			});
		}
		return this;
	};
	iTreeGrid.prototype.rootFilterApplay = function(roots){
		var that = this,
			currRoots = this.treeView.roots.map(function(el){return parseInt(el.id);}),
			forUnload = currRoots.difference(roots),
			forLoad = roots.difference(currRoots);
		for(var i=0,len=forUnload.length;i<len;i++){
			this.rootItemUnload(forUnload[i]);
		}
		this.RefreshData();
		for(var i=0,len=forLoad.length;i<len;i++){
			this.rootItemLoad(forLoad[i]);
		}
		if(that.selectedItems.length){
			for(var i=0,len=that.selectedItems.length;i<len;i++)
				if(that.treeView.nodes.indexOf(that.selectedItems[i])<0)
					that.selectedItems.splice(i,1);
		}
	};
	var _createColumnsModel = function(userColModel){
		var ucm = [],
			acc = 0,
			preSum = userColModel.reduce(function(s,elm){return s+elm.width},0),
			fixSum = userColModel.filter(function(elm){return elm.size=="fixed"}).reduce(function(s,elm){return s+elm.width},0);
		ucm = userColModel.map(function(colDef){
			if(colDef.size == "fixed")
				colDef.size = colDef.width + "px"
			else colDef.size = Math.floor(colDef.width*100/(preSum-fixSum)) + "%";
			return colDef;
		});
		return ucm;
	};
	var _getNextRootId = function(roots,id){
		for(var i=0,len=roots.length;i<len;i++){
			var curID = roots[i];
			if(id<curID)break;
			if(i==len-1)curID=-1
		}
		return curID;
	};

	iTreeGrid.count = 0;

	return iTreeGrid;
}(window);

var ICustomColumn = function(){
    function ICustomColumn(options){
        /**/
    	var  _fieldName
  			,_dataType
  			,_btnStyle
  			,_showHint
  			,_width
  			,_index
  			,_title
  			,_align
  			,_color
  			,_valueTemplate
  			,_valueFormatter
  			,_grid;
  		var settings = _extend({}, defaults, options);
        //блок ниже с проверкой обязательного заполнения
        _grid = settings.grid;
        _fieldName = settings.field;
        _title = settings.display;
        _dataType = settings.dataType;
        _index = settings.index;
        _width = settings.width;
        _showHint = settings.showHint;
        _btnStyle = settings.buttonStyle;
        this.handlers = {};
        Object.defineProperty(this, 'FieldName', {
            get: function() {
                return _fieldName;
            }
        });
        Object.defineProperty(this, 'DataType', {
            get: function() {
                return _dataType;
            }
        });
        Object.defineProperty(this, 'Index', {
            get: function() {
                return _index;
            }
        });
        Object.defineProperty(this, 'size', {
            get: function() {
                return _width;
            },
            set: function(w){
            	var colClass = "col-" + this.Index,
				cells = document.getElementsByClassName(colClass);
				_width = w;
				jQuery('.title-cell.'+colClass).width(_width -11);
				jQuery('.grid-cell.'+colClass).width(_width - 6);
            }
        });
        // Object.defineProperty(this, 'Title', {
        //     get: function() {
        //         return _title;
        //     }
        // });
        Object.defineProperty(this, 'ShowHint', {
            get: function() {
                return _showHint;
            },
            set: function(v){
            	_showHint = v;
            }
        });
        Object.defineProperty(this, 'ButtonStyle', {
            get: function() {
                return _btnStyle;
            },
            set: function(v){
            	_btnStyle = v;
            }
        });
        var defTitle = {
			type: 'div',
			cssString: 'width:'.concat(_width,'px;') + ((_dataType=='boolean') ? 'text-align:center;' : ''),
			props: {
				className: 'title-cell ' + 'col-' + _index,
				children: [{ props: { nodeValue: _title } }]
			}
		}
        ,defCell = {
			type: 'th',
			props: {
				children: [defTitle]
			}
		};
        this.DOMElemet = renderElement(defCell,_grid.headerElement.getElementsByTagName('tr')[0]);
    }
    inherit(ICustomColumn,EventTarget);
    ICustomColumn.prototype.constructor = ICustomColumn;
    var p = ICustomColumn.prototype;
    p.createColumn = function(){

    }
    p.setColumnSize = function(columnIndex){

    }
    var defaults = {
        width          : 100,
        showHint	   : false,
        buttonStyle    : 'none',//0 - none (не показывать); 1 - ellipsis (кнопка ... справа); 2 - link (кнопка в виде ссылки на содержимом)
        color          : '#000000',
        overflowX      : 'hidden',
        overflowY      : 'hidden',
        cursor         : 'default'
    };
    return ICustomColumn
}();

function createFieldDefinition(params){
	var cellDefinition,
		dataType = params.column.DataType,
		btnStyle = params.column.ButtonStyle,
		columnIndex = params.column.Index,
		viewMode = params.viewMode,
		itemType = params.rowData.ItemType,
		level = params.rowData.Level;
	// document.trace('columnIndex: ' + columnIndex + '\ndataType: ' + dataType + '\nitemType: ' + itemType  + '\ntnStyle: ' + btnStyle);
	if(columnIndex==5){
		if(itemType!='component'){
			cellDefinition = createRowIndenter(params);
		}
		else{
			if(viewMode==2){
				cellDefinition = createRowChecker(params)
			}
			else{
				cellDefinition = createDataCell(params)
			}
		}
	}
	else{
		if(dataType=='boolean'){
			cellDefinition =  createCheckBoxCell(params);
		}
		else{
	        switch(btnStyle){
	            case "none":
	            	cellDefinition = createDataCell(params);
	                break;
	            case "ellipsis":
	            	cellDefinition = createButtonCell(params);
	                break;
	            case "link":
	            	cellDefinition = createLinkCell(params);
	                break;
	        }
		}
	}
	// document.trace(JSON.stringify(cellDefinition));
	return cellDefinition;
};
function createRowIndenter(params){
	var
	indenter = {
		type: 'span',
		cssString: 'margin-left: ' + params.rowData.Level * 11 + 'px;',
		props: {
			className: DATA_INDENTER_CLASS + ' ' + SEARCH_TARGET_FIELD,
			children: [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [indenter]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}
function createRowChecker(params){
    var
    source = {
		type: 'span',
		props: {
			title: params.rowData[params.column.FieldName] ? params.rowData[params.column.FieldName]: '',
			className: DATA_CHECKBOX_CLASS + ' ' + SEARCH_TARGET_FIELD,
			children: [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
    checksource = {
		type: 'input',
		props: {
			type: 'checkbox',
			onChange: params.rowCheckHandler,
			checked: params.rowData['Selected'] ? true : false,
			className: ''
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [checksource, source]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}
function createDataCell(params){
    var
    source = {
		type: 'span',
		props: {
			title: params.rowData[params.column.FieldName] ? params.rowData[params.column.FieldName]: '',
			className: (params.column.Index==5) ? SEARCH_TARGET_FIELD : "",
			children: [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [source]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}
function createCheckBoxCell(params){
    var
    check = {
		type: 'input',
		cssString: 'margin-top: 4px;',
		props: {
			type: 'checkbox',
			onChange: params.cellEventHandler,
			className: ''
		}
    },
    source = {
		type: 'span',
		props: {
			title: params.rowData[params.column.FieldName] ? params.rowData[params.column.FieldName]: '',
			className: 'checkaccept',
			children: (params.rowData.ItemType == 'component') ? [check] : [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [source]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}
function createButtonCell(params){
    var
    button = {
		type: 'div',
		// cssString: 'margin: 2px 0px 2px auto;top: 0px;width: 19px;height: 19px;right:2px;position:absolute;' + (params.rowData['Selected'] ? '' : 'display:none;'),
		cssString: 'margin: 2px 0px 2px auto;top: 0px;width: 19px;height: 19px;right:2px;position:absolute;' + ((params.rowData.ItemType == 'component') ? '' : 'display:none;'),
		props: {
			onClick: params.cellEventHandler,
			className: '',
			innerHTML: '<img style="width: 16px; height: 16px; margin-bottom: 2px; margin-left: 4px;" src=\'' + ellipsis_off  + '\'>'
		}
    },
    source = {
		type: 'span',
		cssString: 'word-break:break-all',
		props: {
			title: params.rowData[params.column.FieldName] ? params.rowData[params.column.FieldName]: '',
			className: "",
			children: [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [source,button]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}
function createLinkCell(params){
    var value = params.rowData[params.column.FieldName],
    link = {
    	type: 'a',
    	props: {
    		href: '/',
    		onClick: params.cellEventHandler,
    		children: [{ props: { nodeValue: replaceAll(value,', ','; ') } }]
    	}
    },
    source = {
		type: 'span',
		props: {
			title: params.rowData[params.column.FieldName] ? params.rowData[params.column.FieldName]: '',
			className: '',
			children: value ? [link] : [{ props: { nodeValue: params.rowData[params.column.FieldName] } }]
		}
    },
	defValue = {
		type: 'div',
		cssString: 'width:'.concat(params.column.size,'px;'),
		props: {
			className: DATA_CELL_CLASS + ' ' + 'col-' + params.column.Index,
			children: [source]
		}
	},
  	defCell = {
		type: 'td',
		props: {
			onClick: params.cellClickHandler,
			children: [defValue]
		}
	};
	return defCell;
}

var defColumnsModel = 	[
 { field: "ID"}
,{ field: "ParentID"}
,{ field: "ItemType"}
,{ field: "Level"}
,{ field: "PathStr"}
];

var
 GRID_CLASS          = 'tree-grid'
,GRID_HEADER_CLASS   = 'grid-header'
,TITLE_ROW_CLASS     = 'title-row'
,TITLE_CELL_CLASS    = 'title-cell'
,GRID_DATA_CLASS     = 'grid-data'
,GRID_VIEW_CLASS     = 'grid-view'
,DATA_ROW_CLASS      = 'data-row'
,DATA_CELL_CLASS     = 'grid-cell'
,DATA_INDENTER_CLASS = 'grid-indenter'
,DATA_CHECKBOX_CLASS = 'grid-checkbox'
//класс разрешает поиск только по этой колонке
,SEARCH_TARGET_FIELD = 'search-field';

function renderElement(){
	var container,
		callback,
		type = arguments[0].type,
		id = arguments[0].id,
		props = arguments[0].props,
		cssString = arguments[0].cssString,
		isTextElement = !type,
		fragment  = document.createDocumentFragment(),
		element = isTextElement ? document.createTextNode('') : document.createElement(type);
	if(arguments[1]){
		if(typeof arguments[1] === 'function')
			callback = arguments[1]
		else
			container = arguments[1];
	}
	var isListener = function(p){return p.startsWith('on');}
	var isAttribute = function(p){return !isListener(p) && p !== 'children';}
	Object.keys(props).forEach(function(p){
		if (isAttribute(p))	element[p] = props[p];
		if (!isTextElement && isListener(p)){
			var evntName = p.toLowerCase().slice(2);
			element.addEventListener(evntName, props[p]);
		}
	});
	if (!isTextElement && props.children && props.children.length){
		if(callback){
			var func = callback;
			func(element);
		}
		props.children.forEach(function(childElement){
			var ce = renderElement(childElement, element);
			if(func) func(ce);
		});
	}
	if(cssString){
		cssString.split(';').forEach(function(strProp){
			element.style[strProp.split(':')[0]] = strProp.split(':')[1];
		});
	}
	if(id) element.id = id;
	if(container)
		return container.appendChild(element)
	else {
		return fragment.appendChild(element);
	}
}
var
titleRow = {
	type: 'tr',
	cssString: 'display: table-row;',
	props: {
		className: TITLE_ROW_CLASS,
		children: []
	}
}
,thead = {
	type: 'thead',
	props:{
		children: [titleRow]
	}
}
,header = {
	type: 'table',
	props:{
		cellSpacing: "0",
		cellPadding: "0",
		border: "0",
		children: [thead]
	}
}
,headerView ={
	type: 'div',
	cssString: 'float:left;',
	props: {
		children: [header]
	}
}
,gridHeader = {
	type: 'div',
	props: {
		className: GRID_HEADER_CLASS,
		children: [headerView]
	}
}
,tbody = {
	type: 'tbody',
	props:{
		children: []
	}
}
,data = {
	type: 'table',
	props:{
		cellSpacing: "0",
		cellPadding: "0",
		border: "0",
		children: [tbody]
	}
}
,gridData = {
	type: 'div',
	props: {
		className: GRID_DATA_CLASS,
		children: [data]
	}
}
,treeGrid = {
	type: 'div',
	props: {
		className: GRID_CLASS,
		children: [gridHeader,gridData]
	}
};