var tvExpandAll = function(){
  ig.expandAll();
}
var tvCollapseAll = function(){
  ig.collapseAll();
  ig.fire({type:'onSetActiveRow',rowIndex:0});
}
var mComponentCreate = function(){
  var group,system,component,parentNode,
      def = [system,group,component],
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  switch (eType) {
    case 'system':
      system = parseInt(elm.getAttribute('data-row-id'));
      admUI.componentCreate(system,group);
      break;
    case 'group':
      system = parseInt(elm.getAttribute('data-parent-id'));
      group = parseInt(elm.getAttribute('data-row-id'));
      admUI.componentCreate(system,group);
      break;
    case 'component':
      component = parseInt(elm.getAttribute('data-row-id'));
      parentNode = ig.treeView.tree[component].parentNode();
      switch(parentNode.row.getAttribute('data-item-type')){
      case 'system':
        system = parseInt(elm.getAttribute('data-parent-id'));
        break;
      case 'group':
        group = parseInt(elm.getAttribute('data-parent-id'));
        parentNode = ig.treeView.tree[component].parentNode();
        system = parentNode.row.getAttribute('data-parent-id')
        break;
      }
      admUI.componentCreate(system,group);
      break;
  }
}
var mComponentUpdate = function(){
  var component,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  if(eType == 'component'){
      component = parseInt(elm.getAttribute('data-row-id'));
      admUI.componentUpdate(component);
  }
}
var mCreateGroup = function() {
  var component,group,system,parentID,parent,groupID,
  elm = ig.activeRow,
  eType = elm.getAttribute('data-item-type');
  switch(eType){
      case 'component':
          component = parseInt(elm.getAttribute('data-row-id'));
          parentID = parseInt(elm.getAttribute('data-parent-id'));
          var parentRow = document.querySelector("tr[data-row-id='" + parentID + "']");
          if(parentRow.getAttribute('data-parent-id') != '0'){
            group = parentID;
            system = parseInt(parentRow.getAttribute('data-parent-id'));
          }
          else{
            group = 0;
            system = parentID;
          }
          break;
      case 'group':
          component = 0;
          group = parseInt(elm.getAttribute('data-row-id'));
          system = parseInt(elm.getAttribute('data-parent-id'));
          break;
      case 'system':
          system = parseInt(elm.getAttribute('data-row-id'));
          group = 0;
          component = 0;
          break;
  }
  pCreateGroup(system,group);
}
var mDeleteGroup = function() {
  var groupName,group,system,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  if(eType == 'group'){
    group = parseInt(elm.getAttribute('data-row-id'));
    system = parseInt(elm.getAttribute('data-parent-id'));
    pDeleteGroup(system,group);
  }
}
var mRenameGroup = function() {
  var groupName,group,system,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  if(eType == 'group'){
    group = parseInt(elm.getAttribute('data-row-id'));
    system = parseInt(elm.getAttribute('data-parent-id'));
    pRenameGroup(system,group);
  }
}
var mShowAccessTypes= function() {
  var system,component,rootNode,parentNode,parentType,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  switch (eType) {
    case 'system':
      system = parseInt(elm.getAttribute('data-row-id'));
      break;
    case 'group':
      system = parseInt(elm.getAttribute('data-parent-id'));
      break;
    case 'component':
      component = parseInt(elm.getAttribute('data-row-id'));
      parentNode = ig.treeView.tree[component].parentNode();
      switch(parentNode.row.getAttribute('data-item-type')){
      case 'system':
        system = parseInt(elm.getAttribute('data-parent-id'));
        break;
      case 'group':
        parentNode = ig.treeView.tree[component].parentNode();
        system = parentNode.row.getAttribute('data-parent-id');
        break;
      }
      break;
  }
  admUI.showAccessTypes(system);
}
var mBlockUnblock = function(){
  var component,reqState,t,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
  if(eType == 'component'){
    component = parseInt(elm.getAttribute('data-row-id'));
    reqState = admUI.componentBlockUnblock(component);
    t = ig.activeRow.querySelectorAll('SPAN')[1];
    t.innerText = reqState;
    if(reqState == 'Узгоджено')
      ig.activeRow.classList.remove('blocked')
    else
      ig.activeRow.classList.add('blocked');
    ig.fire({type:'onSetActiveRow',rowIndex:ig.treeView.tree[component].row.rowIndex});
  }
}
var mShowManagers = function() {
    var group,system,component,rootNode,parentNode,parentType,
      elm = ig.activeRow,
      eType = elm.getAttribute('data-item-type');
    switch (eType) {
    case 'system':
        system = parseInt(elm.getAttribute('data-row-id'));
        admUI.showManagers(system);
        break;
    case 'group':
        system = parseInt(elm.getAttribute('data-parent-id'));
        group = parseInt(elm.getAttribute('data-row-id'));
        admUI.showManagers(system);
        break;
    case 'component':
        component = parseInt(elm.getAttribute('data-row-id'));
        parentNode = ig.treeView.tree[component].parentNode();
        switch(parentNode.row.getAttribute('data-item-type')){
        case 'system':
            system = parseInt(elm.getAttribute('data-parent-id'));
            break;
        case 'group':
            group = parseInt(elm.getAttribute('data-parent-id'));
            parentNode = ig.treeView.tree[component].parentNode();
            system = parentNode.row.getAttribute('data-parent-id')
            break;
        }
        admUI.showManagers(system);
        break;
    }
}
var mShowRegistry = function() {
    var group,system,component,rootNode,parentNode,parentType,
        elm = ig.activeRow,
        eType = elm.getAttribute('data-item-type');
    switch (eType) {
    case 'system':
        system = parseInt(elm.getAttribute('data-row-id'));
        break;
    case 'group':
        system = parseInt(elm.getAttribute('data-parent-id'));
        break;
    case 'component':
        component = parseInt(elm.getAttribute('data-row-id'));
        parentNode = ig.treeView.tree[component].parentNode();
        switch(parentNode.row.getAttribute('data-item-type')){
        case 'system':
            system = parseInt(elm.getAttribute('data-parent-id'));
            break;
        case 'group':
            group = parseInt(elm.getAttribute('data-parent-id'));
            parentNode = ig.treeView.tree[component].parentNode();
            system = parentNode.row.getAttribute('data-parent-id')
            break;
        }
        break;
    }
    admUI.showRegistry(system);
}
var mShowAccessScheme = function() {
    var system,group,
        elm = ig.activeRow,
        eType = elm.getAttribute('data-item-type');
    if(eType == 'component')
        pShowAccessScheme(system,group,parseInt(elm.getAttribute('data-row-id')));
}
var mShowHistory = function() {
    var row = ig.activeRow;
    if(row.dataset.itemType == 'component')
        admUI.showHistory(parseInt(row.dataset.rowId));
}
var mSendForPerform = function(){
  try{
    admUI.requestSendForPerform();
  }
   catch(e){alert(e)}
}
var mSyncTemplate = function(){
  var system = admUI.getT60InfSysId(),
      result = admUI.SyncTemplate();
  if(result)
    ig.rootItemUnload(system).RefreshData().rootItemLoad(system);
};
var getAccessableSystems = function(){
  var arr,arrString = admUI.getAccessableSystems();
  if(arrString)
    arr = JSON.parse(arrString);
  return arr;
};
var menuItemsDef = [
    /* 0*/ {caption:"Розгорнути все",enabledImage:'expand-all.png',disabledImage:'expand-all-disabled.png',command:tvExpandAll}
    /* 1*/,{caption:"Згорнути все",enabledImage:'collaps-all.png',disabledImage:'collaps-all-disabled.png',command:tvCollapseAll}
    /* 2*/,{caption:"Створити компонент",enabledImage:'component-create.png',disabledImage:'component-create-disabled.png',command:mComponentCreate}
    /* 3*/,{caption:"Редагувати компонент",enabledImage:'component-edit.png',disabledImage:'component-edit-disabled.png',command:mComponentUpdate}
    /* 4*/,{caption:"Створити групу",enabledImage:'group-create.png',disabledImage:'group-create-disabled.png',command:mCreateGroup}
    /* 5*/,{caption:"Перейменувати групу",enabledImage:'group-rename.png',disabledImage:'group-rename-disabled.png',command:mRenameGroup}
    /* 6*/,{caption:"Видалити групу",enabledImage:'group-delete.png',disabledImage:'group-delete-disabled.png',command:mDeleteGroup}
    /* 7*/,{caption:'Типи доступів',enabledImage:'access-types.png',disabledImage:'access-types-disabled.png',command:mShowAccessTypes}
    /* 8*/,{caption:'Блокувати/ Розблокувати',enabledImage:'component-block.png',disabledImage:'component-block-disabled.png',command:mBlockUnblock}
    /* 9*/,{caption:'Відповідальні',enabledImage:'managers.png',disabledImage:'managers-disabled.png',command:mShowManagers}
    /*10*/,{caption:'Реєстр заявок',enabledImage:'request-registry.png',disabledImage:'request-registry-disabled.png',command:mShowRegistry}
    /*11*/,{caption:'Схема узгодження',enabledImage:'route-schem.png',disabledImage:'route-schem-disabled.png',command:mShowAccessScheme}
    /*12*/,{caption:'Історія змін',enabledImage:'history.png',disabledImage:'history-disabled.png',command:mShowHistory}
    /*13*/,{caption:'Синхронізація з додатком 60',enabledImage:'template-sync.png',disabledImage:'template-sync-disabled.png',command:mSyncTemplate}
    /*14*/,{caption:'На узгодження',enabledImage:'send-for-perform.png',disabledImage:'send-for-perform-disabled.png',command:mSendForPerform}
];
/*методы работы с матрицами согласования*/
var pComponentUpdate = function(system,group,component){
  admUI.componentUpdate(component);
};
var pComponentCreate = function(system,group,component) {
  admUI.componentCreate(system,group);
};
var pBlockUnblock = function(system,group,component){
  var reqState = admUI.componentBlockUnblock(component),
  t = ig.activeRow.querySelectorAll('SPAN')[1];
  t.innerText = reqState;
  if(reqState == 'Узгоджено')
    ig.activeRow.classList.remove('blocked')
  else
    ig.activeRow.classList.add('blocked');
  ig.fire({type:'onSetActiveRow',rowIndex:ig.treeView.tree[component].row.rowIndex});
};
var pShowAccessScheme = function(system,group,component) {
  admUI.ShowAccessScheme(component);
};
/*Методы для работы с группами*/
var pCreateGroup = function(system,group,component) {
  var groupID = admUI.groupCreate(system);
  if(groupID)
    ig.rootItemUnload(system).RefreshData().rootItemLoad(system).setActiveRow(groupID);
};
var pChangeGroup = function(system,group,component){
  var groupID = admUI.groupChange(group,system,component);
  if(groupID)
    ig.rootItemUnload(system).RefreshData().rootItemLoad(system).setActiveRow(component);
};
var pRenameGroup = function(system,group,component) {
  var groupName = admUI.groupRename(group,system);
  ig.rootItemUnload(system).RefreshData().rootItemLoad(system).setActiveRow(group);
};
var pDeleteGroup = function(system,group) {
  var groupID = admUI.groupDelete(group,system);
  if(groupID)
    ig.rootItemUnload(system).RefreshData().rootItemLoad(system).setActiveRow(groupID);
};
var rootItemUnload = function(system){
  var qStr = "SELECT RowID,ID,ParentID,ItemName,Sost,Status,ItemType,Level,PathStr FROM ? where PathStr like '%" + system + "%' and ItemType <>'system' order by PathStr desc",
      forDel = alasql(qStr,[ig.dataSet]);
  if(forDel.length){
    forDel.forEach(function(dataRow){
      var rowIndex = dataRow.RowID,
          id = dataRow.ID,
          item = ig.treeView.tree[id];
      ig.table.deleteRow(rowIndex);
      delete ig.treeView.tree[id];
      ig.treeView.nodes.splice(inArray(item, ig.treeView.nodes), 1);
    });
    ig.treeView.tree[system].children = [];
  }
}
var rootItemUpdate = function(system){
  var qStr = "SELECT RowID,ID,ParentID,ItemName,Sost,Status,ItemType,Level,PathStr FROM ? where PathStr like '%"+ system + "%' and ItemType <>'system' order by PathStr desc",
      forDel = alasql(qStr,[ig.dataSet]);
  if(forDel.length){
    forDel.forEach(function(dataRow){
      var rowIndex = dataRow.RowID,
          id = dataRow.ID,
          item = ig.treeView.tree[id];
      ig.table.deleteRow(rowIndex);
      delete ig.treeView.tree[id];
      ig.treeView.nodes.splice(inArray(item, ig.treeView.nodes), 1);
    });
    ig.treeView.tree[system].children = [];
  }
  ig.treeView.tree[system].collapse();
  ig.RefreshData();
  ig.loadChildrenRows(system);
  if(ig.treeView.tree[system].hasChildren()){
    ig.treeView.tree[system].row.classList.remove('empty');
    ig.treeView.tree[system].row.querySelectorAll('span')[0].classList.add('grid-indenter');
  }
  else{
    ig.treeView.tree[system].row.querySelectorAll('span')[0].classList.remove('grid-indenter');
    ig.treeView.tree[system].row.classList.add('empty');
  }
  ig.fire({type: "onSetActiveRow", rowIndex: ig.treeView.tree[system].row.rowIndex});
}
var userColumnModel = [
    { field: "ItemName", width:140, display: "Найменування", dataType: "string", size: "autofit"},
    { field: "Status",   width:100, display: "Статус",       dataType: "string", size: "fixed"}
   // ,{ field: "Sost",     width:40,  display: "State",        dataType: "string", size: "fixed"}
   // ,{ field: "PathStr",  width:100, display: "PathStr",      dataType: "string", size: "autofit"}
];
var componentMenuMainMenuLinks = [3,2,8,-1,-1,4,-1,11,10,12,7];
function createComponentMenu(){
    cMenu = new iPopupMenu();
    cMenu.Add('Редагувати компонент',pComponentUpdate);//3
    cMenu.Add('Створити компонент',pComponentCreate);//2
    cMenu.Add('Блокувати/Розблокувати',pBlockUnblock);//8
    cMenu.Add('-');
    cMenu.Add('Змінити групу',pChangeGroup);
    cMenu.Add('Створити групу',pCreateGroup);//4
    cMenu.Add('-');
    cMenu.Add('Схема узгодження',pShowAccessScheme);//11
    cMenu.Add('Реєстр заявок на коригування',mShowRegistry);//10
    cMenu.Add('Історія змін',mShowHistory);//12
    cMenu.Add('Типи доступів по ІС',mShowAccessTypes);//7
}
var systemMenuMainMenuLinks = [2,4,7,-1,10,9];
function createSystemMenu(){
    sMenu = new iPopupMenu();
    sMenu.Add('Створити компонент',pComponentCreate);//2
    sMenu.Add('Створити групу',pCreateGroup);//4
    sMenu.Add('Типи доступів по ІС',mShowAccessTypes);//7
    sMenu.Add('-');
    sMenu.Add('Реєстр заявок на коригування',mShowRegistry);//10
    sMenu.Add('Відповідальні за компоненти',mShowManagers);//9
}
var groupMenuMainMenuLinks = [2,4,5,6];
function createGroupMenu(){
    gMenu = new iPopupMenu();
    gMenu.Add('Створити компонент',pComponentCreate);//2
    gMenu.Add('Створити групу',pCreateGroup);//4
    gMenu.Add('Перейменувати групу',pRenameGroup);//5
    gMenu.Add('Видалити групу ',pDeleteGroup);//6
}