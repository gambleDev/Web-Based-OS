function switchTab(type){
	var files = 0;
	
	for(var i = document.getElementById("fileTable").rows.length; i > 1;i--){
		document.getElementById("fileTable").deleteRow(i -1);
	}
	
	if(type == 'app'){
		for (var i in localStorage){
			var newDataType = localStorage[i];
			var dataObject = JSON.parse(newDataType);
		
			if(dataObject.type == "app-shortcut" || dataObject.type == "app"){
				var fileTable = document.getElementById("fileTable");
				
				var row = fileTable.insertRow(files+1);
				row.className = 'fileRow';
				dataObject.runFunction = "launch";
				refinedDataObject = JSON.stringify(dataObject);
				row.setAttribute("onclick", "(function(){parent.postMessage('"+refinedDataObject+"', '*');})()");
				
				var fileName = row.insertCell(0);
				fileName.className = 'fileNameColumn';
				
				var path = row.insertCell(1);
				path.className = 'fileColumn';
				
				var type = row.insertCell(2);
				type.className = 'fileColumn';
				
				fileName.innerHTML = dataObject.title;
				path.innerHTML = dataObject.path;
				type.innerHTML = "Application";
				files++;
			}
		}
	}else{
		var files = 0;
		
		for (var i in localStorage){
			var newDataType = localStorage[i];
			var dataObject = JSON.parse(newDataType);
		
			if(dataObject.type !== "app-shortcut" && dataObject.type !== "app"){
				var fileTable = document.getElementById("fileTable");
				
				var row = fileTable.insertRow(files+1);
				row.className = 'fileRow';
				dataObject.runFunction = "launch";
				
				var fileName = row.insertCell(0);
				fileName.className = 'fileNameColumn';
				
				var path = row.insertCell(1);
				path.className = 'fileColumn';
				
				var type = row.insertCell(2);
				type.className = 'fileColumn';
				
				fileName.innerHTML = dataObject.title;
				path.innerHTML = dataObject.path;
				if(dataObject.type == "note"){
					dataObject.content = "";
					dataObject.path = "Notepad/notepad.html?data="+dataObject.path;
					type.innerHTML = "Note";
				}else{
					type.innerHTML = "Unknown";
				}
				
				row.setAttribute("onclick", "(function(){parent.postMessage('"+JSON.stringify(dataObject)+"', '*');})()");
				
				files++;
			}
		}
	}
}

