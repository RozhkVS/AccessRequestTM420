function resolveMakeup(options) {
	this.user_id = options.user_id;
	this.request_id = options.request_id;
	this.stage_number = options.stage_number;
	this.resolves = new Array();
	return this;
}
resolveMakeup.prototype = {
	init: function(data){
		var that = this, resolves = this.resolves;
		data.forEach(function(e,i){
			var pRes = new performerResolve(that,e.ID,e.ResolveID);
			resolves.push(pRes)
		});
		return this;
	},
	change: function(param){
		if(param.field == "resolution"){
			if(this.onResolutionChange)
				this.onResolutionChange.apply(param);
		}
		else{
			if(this.onCommentChange)
				this.onCommentChange.apply(param);		}
	},
	resolve:function(component_id){
		return this.resolves.find(function(e){if(e.component_id == component_id)return true;});
	},
	count: function(){
		return this.resolves.length;
	},
	accepted: function(){
		var cx = 0;
		this.resolves.forEach(function(e){
			if(e.resolution)cx++;
		});
		return cx;
	},
	rejected: function(){
		var cx = 0;
		this.resolves.forEach(function(e){
			if(e.resolution !== undefined)
				if(!e.resolution)cx++;
		});
		return cx;
	},
	complete: function(){
		var r = this.count() - (this.accepted() + this.rejected());
		return (r > 0) ? false : true;
	},
	setResolution: function(component_id,resolution){
		var res;
		if(this.resolves.length){
			res = this.resolves.find(function(e){if(e.component_id == component_id)return true;});
			if(res) res.resolution = resolution;
		}
	}
};

resolveMakeup.prototype.onResolutionChange = null;
resolveMakeup.prototype.onCommentChange = null;

function performerResolve(parent,component_id,id){
	this.id = id;
	this.parent = parent;
	this.component_id = component_id;
	var _resolution = undefined, _comment = new String();
	Object.defineProperty(this, "resolution", {
		get: function() {
			return _resolution;
		},
		set: function(val) {
			if(_resolution != val){
				_resolution = val;
				if(val == undefined && _comment.length)
					_comment = '';
				this.parent.change({"field":"resolution","value":_resolution,"comment":_comment,"component_id":this.component_id,"id":this.id});
			}
		}
	});
	Object.defineProperty(this, "comment", {
		get: function() {
			return _comment;
		},
		set: function(val) {
			if(_comment != val){
				_comment = val;
				this.parent.change({"field":"comment","value":_resolution,"comment":_comment,"component_id":this.component_id,"id":this.id});
			}
		}
	});
	return this;
}

var viewModel = {
            "Agreement" : [
			/* 0*/  { field: "ItemName",       width: 120, display: "Найменування",       dataType: "string",   size: "autofit", showHint: false},
			/* 1*/  { field: "AccessTypes",    width: 150, display: "Типи доступiв",      dataType: "string",   size: "fixed",   showHint: true},
			/* 2*/  { field: "Accept",         width: 80,  display: "Узгоджено",          dataType: "boolean",  size: "fixed",   showHint: false},
			/* 3*/  { field: "Reject",         width: 80,  display: "Відхилено",          dataType: "boolean",  size: "fixed",   showHint: false},
            		/* 4*/  { field: "Description",    width: 150, display: "Обгрунтування",      dataType: "string",   size: "autofit", showHint: true },
			/* 5*/  { field: "ResolveComment", width: 150, display: "Причина відхилення", dataType: "string",   size: "autofit", showHint: false, buttonStyle: "ellipsis"}
            ],
            "Preview" : [
			/* 0*/  { field: "ItemName",       width: 150, display: "Найменування",       dataType: "string",   size: "autofit", showHint: false},
			/* 1*/  { field: "AccessTypes",    width: 200, display: "Типи доступiв",      dataType: "string",   size: "fixed",   showHint: true},
			/* 2*/  { field: "Description",    width: 150, display: "Обгрунтування",      dataType: "string",   size: "autofit", showHint: true }
            ],
            "Done" : [
			/* 0*/  { field: "ItemName",       width: 120, display: "Найменування",       dataType: "string",   size: "autofit", showHint: false},
			/* 1*/  { field: "AccessTypes",    width: 150, display: "Типи доступiв",      dataType: "string",   size: "fixed",   showHint: true},
			/* 2*/  { field: "Accept",         width: 80,  display: "Виконати",           dataType: "boolean",  size: "fixed",   showHint: false},
			/* 3*/  { field: "Reject",         width: 80,  display: "Вiдмовити",          dataType: "boolean",  size: "fixed",   showHint: false},
            		/* 4*/  { field: "RespComment",    width: 100, display: "Коментар виконавцю", dataType: "string",   size: "autofit", showHint: true , buttonStyle: "ellipsis"},
			/* 5*/  { field: "Description",    width: 100, display: "Обгрунтування",      dataType: "string",   size: "autofit", showHint: true , buttonStyle: "ellipsis"},
			/* 6*/  { field: "ResolveComment", width: 100, display: "Причина відмови",    dataType: "string",   size: "autofit", showHint: true, buttonStyle: "ellipsis"}
            ]
          };
var vModel = {
"Agreement" : [
        {id: "btnExpand",  name: "Розгорнути все", bimage: "css/images/expand.gif", onpress: function(){tvExpandAll()}}
        ,{id: "btnCollapse",  name: "Згорнути все", bimage: "css/images/collapse.gif",onpress: function(){tvCollapseAll()}},
        ,{separator: true}
        ,{id: "btnAccept",  name: "Узгодити все", bimage: "images/accept_all.gif",onpress: function(){acceptAll();}}
        ,{id: "btnReject",  name: "Вiдхилити все", bimage: "images/reject_all.gif",onpress: function(){rejectAll();}}
      ],
"Preview" : [
        {id: "btnExpand",  name: "Розгорнути все", bimage: "css/images/expand.gif", onpress: function(){tvExpandAll()}}
        ,{id: "btnCollapse",  name: "Згорнути все", bimage: "css/images/collapse.gif",onpress: function(){tvCollapseAll()}},
        ,{separator: true}
      ],
"Done" : [
        {id: "btnExpand",  name: "Розгорнути все", bimage: "css/images/expand.gif", onpress: function(){tvExpandAll()}}
        ,{id: "btnCollapse",  name: "Згорнути все", bimage: "css/images/collapse.gif",onpress: function(){tvCollapseAll()}},
        ,{separator: true}
        ,{id: "btnAccept",  name: "Виконати все", bimage: "images/accept_all.gif",onpress: function(){acceptAll();}}
        ,{id: "btnReject",  name: "Вiдмовити все", bimage: "images/reject_all.gif",onpress: function(){rejectAll();}}
        ,{id: "btnUnselect",  name: "Зняти всi", bimage: "images/unselect_all.gif",onpress: function(){unselectAll();}}
      ]
  };