//COMMUNICATION FROM APP IFRAMES
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function(e){
	var dataObject = JSON.parse(e.data);
	if(dataObject.runFunction == "launch"){
		launch(dataObject.title, dataObject.path);
	}else if(dataObject.runFunction == "addToStorage"){
		var oldObject = JSON.parse(e.data);
		var newObject = { 'type': oldObject.type, 'title': oldObject.title, 'path': oldObject.path};
		notification('New application installed');
		localStorage.setItem(localStorage.length+1, JSON.stringify(newObject));
		
		loadAppData();
	}
}, false);

//NOTIFICATIONS
function notification(message, time){
	if(time == null){time=1500;}
	document.getElementById("notificationCenter").innerHTML = message;
	document.getElementById("notificationCenter").style.display = "block";
	document.getElementById("notificationCenter").style.width = screen.width-55;
	
	setTimeout(function(){document.getElementById("notificationCenter").style.display = "none"},time);
}

//LOCK SCREEN FUNCTION - CALL TO LOCK
function checkLockScreenLogin(){
	var password = document.getElementsByName("lock-screen-password")[0].value;
	var lockScreen = document.getElementsByClassName("lock-screen")[0];
	if(password != "gmfRocks"){
		notification("Incorrect password!");
		document.getElementsByName("lock-screen-password")[0].value = "";
	}else{
		lockScreen.parentNode.removeChild(lockScreen);
	}
	return false;
}

function lockScreen(failed){
	var div = document.createElement("div");
	div.className = "lock-screen";
	div.innerHTML = "<div class='lock-screen-login'>"+
						"Login<hr>"+
						"Please enter your password below:<br><br>"+
						"<form onsubmit='return checkLockScreenLogin();'>"+
							"<input type='text' name='lock-screen-password'><br>"+
							"<input type='submit'>"+
						"</form>"+
					"</div>";
	document.body.insertBefore(div, document.body.firstChild);
}

//LOAD APPLICATION DATA - MAIN MENU
function loadAppData(){
	document.getElementById("appLaunchContainer").innerHTML = "";
	
	for (var i in localStorage){
		var newDataType = localStorage[i];
		var dataObject = JSON.parse(newDataType);
		
		if(dataObject.type == "app-shortcut"){
			document.getElementById("appLaunchContainer").innerHTML += "<li class='darkerli'>"+
																			"<a onclick=\"launch('"+dataObject.title+"', '"+dataObject.path+"', '250', '500')\">"+
																				"<i class='fa fa-lg'></i>"+
																				"<span class='nav-text'>"+dataObject.title+"</span>"+
																			"</a>"+
																		"</li>";
		}
	}
}
loadAppData();

//DESKTOP TIME IN MENU
function startTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var dd=today.getDate();
	var mm=today.getMonth()+1;
	var yyyy=today.getFullYear();
	//AM/PM Calculation
	var twentyFourHourClock = (h+24-2)%24;
	if(twentyFourHourClock > 12){ ampm = 'PM'; } else{ ampm = 'AM'; }
	
	m = checkTime(m);
	s = checkTime(s);
	document.getElementsByClassName('menu-time')[0].innerHTML = h+":"+m+":"+s+" "+ampm+"<br>"+mm+"/"+dd+"/"+yyyy;
	var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
	if (i<10) {i = "0" + i};
	return i;
}
startTime();

//LAUNCHING APPLICATIONS
function launch(title, path, height, width){
	desktop = document.getElementsByClassName('desktop')[0];
	
	if(height == null || height <= 250){ height = '250px'; } else{ height = height+'px'; }
	if(width == null || width <= 500){ width = '500px'; } else{ width = width+'px'; }
	
	var appWindow = document.createElement('div');
	appWindow.className = 'window';
	appWindow.style.cssText = "left:260px;top:0px;width:"+width+";height:"+height+";";
	
	var titlebar = document.createElement('div');
	titlebar.className = 'title-bar';
	
	var titlebarText = document.createTextNode(title);
	
	titlebar.appendChild(titlebarText);
	appWindow.appendChild(titlebar);
	
	var iframe = document.createElement('iframe');
	iframe.frameBorder = 0;
	iframe.setAttribute("src", path);
	
	appWindow.appendChild(iframe);
	
	desktop.appendChild(appWindow);
}

//FOR MAXIMISING THE WINDOW - AND UN MAXIMISING
document.addEventListener('dblclick', function(e) { 
	var target = e.target != null ? e.target : e.srcElement;
	var fullScreenExactWidth = screen.width-55;
	var fullScreenExactHeight = '100%';
	if(e.detail === 2 && target.className == 'title-bar') {
		if(target.parentNode.style.width != fullScreenExactWidth && target.parentNode.style.height != fullScreenExactHeight){
			target.parentNode.style.top = '0px';
			target.parentNode.style.left = '55px';
			target.parentNode.style.width = fullScreenExactWidth;
			target.parentNode.style.height = fullScreenExactHeight;
		}else{
			target.parentNode.style.width = '500px';
			target.parentNode.style.height = '250px';
		}
	}
}, false);

//CONTEXT MENU
/*
document.addEventListener('contextmenu', function(e) { 
	e.preventDefault();
	var element =  document.getElementById('contextMenu');
	if (typeof(element) != 'undefined' && element != null){ element.remove(); }

	var cMenu = document.createElement('div');
	cMenu.setAttribute("id", "contextMenu");
	cMenu.style.left = e.clientX+"px";
	cMenu.style.top = e.clientY+"px";
	
	cMenu.innerHTML = "<div class='contextMenuItem'>Hi</div><div class='contextMenuItem'>Hi</div><div class='contextMenuItem'>Hi</div>";

	document.getElementsByTagName('body')[0].appendChild(cMenu);

	return false;
}, false);

document.addEventListener('click', function(e) { 
	var element =  document.getElementById('contextMenu'); 
	if (typeof(element) != 'undefined' && element != null){ element.remove(); } 
}, false);
*/
//THIS AND BELOW IS FOR DRAG AND DROP! DONT TOUCH!
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _dragElement;
var _newZIndex = 1;

InitDragDrop();

function InitDragDrop(){
	document.onmousedown = OnMouseDown;
	document.onmouseup = OnMouseUp;
}

function OnMouseDown(e){
	if (e == null){
		e = window.event; 
	}
	
	var target = e.target != null ? e.target.parentNode : e.srcElement.parentNode;
  
	if ((e.button == 1 && window.event != null || e.button == 0) && target.className == 'window'){
		_startX = e.clientX;
		_startY = e.clientY;
	
		_offsetX = ExtractNumber(target.style.left);
		_offsetY = ExtractNumber(target.style.top);
	
		target.style.zIndex = 1000;
		
		_dragElement = target;

		document.onmousemove = OnMouseMove;
	
		document.body.focus();

		document.onselectstart = function () { return false; };

		target.ondragstart = function() { return false; };
		
		return false;
	}
}

function OnMouseMove(e){
	if (e == null){ 
		var e = window.event; 
	}
	
	// DRAGGING
	_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
	_dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
}

function OnMouseUp(e)
{
	if (_dragElement != null){
		//CLOSE THE WINOW
		var rect = _dragElement.getBoundingClientRect();
		var offScreenRight = screen.width-rect.right;
		if(offScreenRight <= -10 && rect.top <= -10){
			var closeWindow = confirm("Would you like to close this window?");
			if(closeWindow == true){
				_dragElement.parentNode.removeChild(_dragElement);
			}else{
				_dragElement.style.top = '0px';
			}
		}
		
		
		//PLACE NEW ACTIVE WINDOW ON TOP
		_dragElement.style.zIndex = _newZIndex;
		_newZIndex++;

		document.onmousemove = null;
		document.onselectstart = null;
		_dragElement.ondragstart = null;
   
		_dragElement = null;
	}
}

function ExtractNumber(value){
	var n = parseInt(value);
	return n == null || isNaN(n) ? 0 : n;
}

function $(id){
	return document.getElementById(id);
}
