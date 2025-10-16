var userColumnModel = [
    { field: "ItemName", width:100, display: "������������", dataType: "string", size: "autofit"},
    { field: "Status",   width:120, display: "���� ������i�",       dataType: "string", size: "fixed"}
    ,{ field: "Comment",     width:125,  display: "Comment",        dataType: "string", size: "autofit"}
    ,{ field: "RespComment",  width:125, display: "�������� ���������",      dataType: "string", size: "autofit"}
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
           {caption:"���������� ���",enabledImage:'expand-all.png',disabledImage:'expand-all-disabled.png',command:tvExpandAll}
          ,{caption:"�������� ���",enabledImage:'collaps-all.png',disabledImage:'collaps-all-disabled.png',command:tvCollapseAll}
          ,{caption:"�������� ���������",enabledImage:'component-create.png',disabledImage:'component-create-disabled.png',command:mComponentCreate}
          ,{caption:"���������� ���������",enabledImage:'component-edit.png',disabledImage:'component-edit-disabled.png',command:mComponentUpdate}
          ,{caption:"�������� �����",enabledImage:'group-create.png',disabledImage:'group-create-disabled.png',command:mCreateGroup}
          ,{caption:"������������� �����",enabledImage:'group-rename.png',disabledImage:'group-rename-disabled.png',command:mRenameGroup}
          ,{caption:"�������� �����",enabledImage:'group-delete.png',disabledImage:'group-delete-disabled.png',command:mDeleteGroup}
          ,{caption:'���� �������',enabledImage:'access-types.png',disabledImage:'access-types-disabled.png',command:mShowAccessTypes}
          ,{caption:'���������/ ������������',enabledImage:'component-block.png',disabledImage:'component-block-disabled.png',command:mBlockUnblock}
          ,{caption:'³���������',enabledImage:'managers.png',disabledImage:'managers-disabled.png',command:mShowManagers}
          ,{caption:'����� ������',enabledImage:'request-registry.png',disabledImage:'request-registry-disabled.png',command:mShowRegistry}
          ,{caption:'����� ����������',enabledImage:'route-schem.png',disabledImage:'route-schem-disabled.png',command:mShowAccessScheme}
          ,{caption:'������ ���',enabledImage:'history.png',disabledImage:'history-disabled.png',command:mShowHistory}
          ,{caption:'�� ����������',enabledImage:'send-for-perform.png',disabledImage:'send-for-perform-disabled.png',command:mSendForPerform}
];