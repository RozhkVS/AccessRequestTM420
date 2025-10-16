WindowWidth = function(winscrolls) {
    return
      winscrolls ? document.documentElement.clientWidth : window.innerWidth;
};

WindowHeight = function(winscrolls) {
    return
      winscrolls ? document.documentElement.clientHeight : window.innerHeight;
};

getOffset = function(elem) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem)
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem)
    }
};

getOffsetSum = function(elem) {
    var top = 0,
        left = 0;
    while (elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {
        top: top,
        left: left
    }
};

getOffsetRect = function(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return {
        top: Math.round(top),
        left: Math.round(left)
    }
};

getElementOffset = function(elem){
    var t = 0,l = 0,el = elem;
    while(el){
        Top = Number(el.style.top.replace(/px+$/, ""));
        Left = Number(el.style.left.replace(/px+$/, ""));
        t+=Top; l+=Left;
        el = el.parentElement;
    };
    return {top:t,left:l};
}

coalesce=function(){
  var a,i;
  for(i=0;arguments.length;i++){
    a=arguments[i];
    if(a!=null && a!='' && a!=undefined) return a;
  }
}
choose = function(index){
  if(isNaN(index)) return;
  if (arguments.length>index) return arguments[index+1];
};
cloneObject = function(src) {
  if(!src) return;
  var i,tar;
  if(typeof(src)!='object') return src;
  else {
    if((src.constructor+'')==(Array+'')) tar=[];
    else if((src.constructor+'')==(Date+'')) return src;
    else tar={};
  };
  for(i in src) {
    if(typeof(src[i])!='object') tar[i]=src[i];
    else tar[i]=this.cloneObject(src[i]);
  }
  return tar;
};
copyObject = function(from,to,noclone) {
  var i;
  if (to && !noclone) to=this.cloneObject(to);
  else if(to && noclone) to=to;
  else {
    if(typeof(from)=='object') {
      if((from.constructor+'')==(Array+'')) to=[];
      else if((from.constructor+'')==(Date+'')) return from;
      else to={};
    };
  }
  for(i in from) {
    if(typeof(from[i])!='object') to[i]=from[i];
    else to[i]=this.copyObject(from[i],to[i],true);
  }
  return to;
};
isNull=function(value,_default){
  if(value==null||value==''||value=='undefined') return _default;
  else return value;
};
lookUp = function(value,array){
  var i; if(!array) return;
  for(i=0;i<array.length;i++){
    if(value==array[i]) return i;
  }
};
nullIf = function(){
  var a,i;
  for(i=0;arguments.length;i++){
    a=arguments[i];
    if(a!=null && a!='' && a!=undefined) return null;
  }
};