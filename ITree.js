var Node = (function() {
    function Node(row, tree, table) {
      var parentId;
      this.row = row;
      this.tree = tree;
      this.table = table;
      this.id = this.row.dataset.rowId;
      parentId = this.row.dataset.parentId;
      if (parentId != "0" && parentId !== "")
        this.parentId = parentId;
      this.children = [];
      this.data = {};
    }
    Node.prototype.toJSON = function(){
      if(this.data){
        this.data.ID = parseInt(this.id);
        this.data.ParentID = parseInt(this.parentId);
        return JSON.stringify(this.data);
      }
    };
    Node.prototype.getTree = function(){
      return this.tree;
    };
    Node.prototype.hasChildren = function(){
      return this.children.length ? true : false;
    };
    Node.prototype.ancestors = function() {
      var ancestors, node;
      node = this;
      ancestors = [];
      while (node = node.parentNode()) {
        ancestors.push(node);
      }
      return ancestors;
    };
    Node.prototype.addChild = function(child) {
      return this.children.push(child);
    };
    Node.prototype.collapse = function() {
      this._hideChildren();
      this.row.classList.replace('expanded','collapsed')
      return this;
    };
    Node.prototype.expand = function() {
      this.row.classList.replace('collapsed','expanded');
      this._showChildren();
      return this;
    };
    Node.prototype.expanded = function() {
      return this.row.classList.contains('expanded');
    };
    Node.prototype.hide = function() {
      this._hideChildren();
      this.row.style.display = 'none';
      return this;
    };
    Node.prototype.isBranchNode = function() {
      if(this.children.length > 0)
        return true
      else return false;
    };
    Node.prototype.level = function() {
      return this.row.dataset.itemLevel;
    };
    Node.prototype.parentNode = function() {
    if (this.parentId != '0')
      return this.tree[this.parentId]
    else return null;
    };
    Node.prototype.removeChild = function(child) {
      var i = inArray(child, this.children);
      return this.children.splice(i, 1);
    };
    Node.prototype.reveal = function() {
      if (this.parentId != undefined)
        this.parentNode().reveal();
      return this.expand();
    };
    Node.prototype.show = function() {
      this.row.style.display = 'table-row';
      if (this.expanded())
        this._showChildren();
      return this;
    };
    Node.prototype.toggle = function() {
      if (this.expanded())
        this.collapse()
      else this.expand();
      return this;
    };
    Node.prototype.ancestors = function() {
      var ancestors = [], node = this;
      while (node = node.parentNode()) {ancestors.push(node);}
      return ancestors;
    };
    Node.prototype._hideChildren = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.hide());
      }
      return _results;
    };
    Node.prototype._removeChilds = function() {
      var child, _i, _len, _ref, _results,index,forDelete;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++){
        child = _ref[_i];
        if(child.hasChildren){
         forDelete = child._removeChilds();
         if(forDelete.length)
          forDelete.forEach(function(index){
            _results.push(index)
          });
        }
        index = child.row.rowIndex
        _results.push(index);
      }
      return _results;
    };
    Node.prototype._showChildren = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.show());
      }
      return _results;
    };
    return Node;
})();

var Tree = (function(){
    function Tree(treeView) {
      this.treeView = treeView;
      this.tree = {};
      // Cache the nodes and roots in simple arrays for quick access/iteration
      this.nodes = [];
      this.roots = [];
    }
    Tree.prototype.collapseAll = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.collapse());
      }
      return _results;
    };
    Tree.prototype.expandAll = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.expand());
      }
      return _results;
    };
    Tree.prototype.loadRows = function(rows) {
      var node, row, i;
      if (rows != null) {
        for (i = 0; i < rows.length; i++) {
          row = rows[i];
          if (row.dataset.rowId != null) {
            // node = new Node(row, this.tree, this.table);
            if(!this.table)
              this.table = this.treeView.table;
            node = new Node(row, this.tree, this.table);
            this.nodes.push(node);
            this.tree[node.id] = node;
            if (node.parentId) {
              this.tree[node.parentId].addChild(node);
            } else {
              this.roots.push(node);
            }
          }
        }
      }
      return this;
    };
    Tree.prototype.addRow = function(row) {
      var node;
      if (row != null) {
        if (row.dataset.rowId != null) {
          // node = new Node(row, this.tree,this.treeView);
          if(!this.table)
            this.table = this.treeView.table;
          node = new Node(row, this.tree,this.table);
          this.nodes.push(node);
          this.tree[node.id] = node;
          if (node.parentId)
            this.tree[node.parentId].addChild(node)
          else
            this.roots.push(node);
        }
      }
      return this;
    };
    return Tree;
})()