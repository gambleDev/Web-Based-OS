var saved = false;
var openFileName = '';
var openFileType = 'note';

function resizeTextArea() {
	var heightOfForm = document.getElementById('toolbar').offsetHeight;
	var heightOfBody = document.body.clientHeight;
	var buffer = 75; 
	document.getElementById('note').style.height = (heightOfBody - heightOfForm) - buffer;
}

function save(){
	if(saved === false){
		var fileName = prompt("Please enter a file name:", "note");
		
		openFileName = 'localStorage/'+fileName;
		openFileType = 'note';
		
		var newObject = { 'type': 'note', 'title': fileName, 'path': openFileName, 'content': document.getElementById("note").value};
		localStorage.setItem(localStorage.length+1, JSON.stringify(newObject));
		document.getElementById('messageCenter').innerHTML = "File created!";
	}else{
		if(openFileName == ''){
			alert("Something went very wrong!");
		}else{
			for (var i in localStorage){
				var newDataType = localStorage[i];
				var dataObject = JSON.parse(newDataType);

				if(dataObject.type == openFileType && dataObject.path == openFileName){
					var newObject = { 'type': dataObject.type, 'title': dataObject.title, 'path': dataObject.path, 'content': document.getElementById("note").value};
					localStorage.setItem(i, JSON.stringify(newObject));
					document.getElementById('messageCenter').innerHTML = "File saved!";
				}else{
					localStorage.setItem(i, newDataType);
				}
			}
		}
	}
	saved = true;
}

function openFile(fileName){
	if(fileName == null){ fileName = prompt("Please enter a file name to open:", "localStorage/"); }
	
	openFileName = fileName;
	openFileType = 'note';
	saved = true;
	
	for (var i in localStorage){
		var newDataType = localStorage[i];
		var dataObject = JSON.parse(newDataType);

		if(dataObject.type == openFileType && dataObject.path == openFileName){
			document.getElementById("note").value = dataObject.content;
			localStorage.setItem(i, newDataType);
			document.getElementById('messageCenter').innerHTML = "File opened!";
			return;
		}else{
			localStorage.setItem(i, newDataType);
			document.getElementById('messageCenter').innerHTML = "No file by that name found!";
		}
	}
}

window.params = function(){
    var params = {};
	if(window.location.href.split('?')[1] !== undefined){
		var param_array = window.location.href.split('?')[1].split('&');
		for(var i in param_array){
			x = param_array[i].split('=');
			params[x[0]] = x[1];
		}
	}
    return params;
}();

if(window.params.data){
	openFile(window.params.data);
}