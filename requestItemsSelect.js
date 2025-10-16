var userColumnModel = [
    { field: "ItemName", width:100, display: "Найменування", dataType: "string", size: "autofit"},
    { field: "Status",   width:120, display: "Типи доступiв",       dataType: "string", size: "fixed"}
    ,{ field: "Comment",     width:125,  display: "Comment",        dataType: "string", size: "autofit"}
    ,{ field: "RespComment",  width:125, display: "Коментар виконавцю",      dataType: "string", size: "autofit"}
];

var tvExpandAll = function(){
  ig.expandAll();
}
var tvCollapseAll = function(){
  ig.collapseAll();
  ig.fire({type:'onSetActiveRow',rowIndex:0});
}
var mComponentCreate = function(){
}
var mComponentUpdate = function(){
}
var mCreateGroup = function() {
}
var mDeleteGroup = function() {
}
var mRenameGroup = function() {
}
var mShowAccessTypes= function() {
}
var mBlockUnblock = function(){

}
var mShowManagers = function() {
}
var mShowRegistry = function() {
}
var mShowAccessScheme = function() {
}
var mShowHistory = function() {
}
var mSendForPerform = function(){
}
var menuItemsDef = [
           {caption:"Розгорнути все",enabledImage:'expand-all.png',disabledImage:'expand-all-disabled.png',command:tvExpandAll}
          ,{caption:"Згорнути все",enabledImage:'collaps-all.png',disabledImage:'collaps-all-disabled.png',command:tvCollapseAll}
          ,{caption:"Створити компонент",enabledImage:'component-create.png',disabledImage:'component-create-disabled.png',command:mComponentCreate}
          ,{caption:"Редагувати компонент",enabledImage:'component-edit.png',disabledImage:'component-edit-disabled.png',command:mComponentUpdate}
          ,{caption:"Створити групу",enabledImage:'group-create.png',disabledImage:'group-create-disabled.png',command:mCreateGroup}
          ,{caption:"Перейменувати групу",enabledImage:'group-rename.png',disabledImage:'group-rename-disabled.png',command:mRenameGroup}
          ,{caption:"Видалити групу",enabledImage:'group-delete.png',disabledImage:'group-delete-disabled.png',command:mDeleteGroup}
          ,{caption:'Типи доступів',enabledImage:'access-types.png',disabledImage:'access-types-disabled.png',command:mShowAccessTypes}
          ,{caption:'Блокувати/ Розблокувати',enabledImage:'component-block.png',disabledImage:'component-block-disabled.png',command:mBlockUnblock}
          ,{caption:'Відповідальні',enabledImage:'managers.png',disabledImage:'managers-disabled.png',command:mShowManagers}
          ,{caption:'Реєстр заявок',enabledImage:'request-registry.png',disabledImage:'request-registry-disabled.png',command:mShowRegistry}
          ,{caption:'Схема узгодження',enabledImage:'route-schem.png',disabledImage:'route-schem-disabled.png',command:mShowAccessScheme}
          ,{caption:'Історія змін',enabledImage:'history.png',disabledImage:'history-disabled.png',command:mShowHistory}
          ,{caption:'На узгодження',enabledImage:'send-for-perform.png',disabledImage:'send-for-perform-disabled.png',command:mSendForPerform}
];