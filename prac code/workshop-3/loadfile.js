window.onload = function init() {
var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'C:/Fred/workshop-3/cone.obj', false ); // false for synchronous request
    xmlHttp.send( null );
   console.log(xmlHttp.responseText);
}
