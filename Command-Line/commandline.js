function registerApp(name, path, shortcut){
	if(shortcut == null){
		shortcut = false;
	}
	
	if(shortcut == true){
		var object = { 'type': 'app-shortcut', 'title': name, 'path': path, 'runFunction': 'addToStorage'};
	}else{
		var object = { 'type': 'app', 'title': name, 'path': path, 'runFunction': 'addToStorage'};
	}
	
	parent.postMessage(JSON.stringify(object), '*');
}

var con = {
	element: document.querySelector("#console"),
	input: null,
	command: "",
	text: "",
	inputUpdate: function(){
		this.input = document.querySelector("#active-input");
	},
	commandUpdate: function(){
		this.input.innerHTML = this.command;
	},
	commandAppend: function(key){
		var c = String.fromCharCode(key);
		this.command += c;
		this.commandUpdate();
	},
	commandErase: function(){
		this.command = this.command.slice(0, -1);
		this.commandUpdate();
	},
	commandSend: function(cmd){
		con.textAppend('<p class="input">'+this.command+'</p>');
		if(cmd.match(/^(registerApp\((.+),(.+)\)$)/)){
			eval(cmd);
			con.textAppend("Application registered successfully", true);
		}else if(cmd == "help"){
			con.textAppend(" - To register an app: registerApp([Name the app], [File path to app main file], true/false:create shortcut in menu)", true);
		}else{
			con.textAppend("Unknown Command '" + this.command + "'" , true);
		}
		
		this.command = "";
		this.commandUpdate();
	},
	textUpdate: function(){
		this.element.innerHTML = this.text + '<p id="active-input" class="input"></p';
		this.inputUpdate();
	},
	textAppend: function(text, p){
		if(p){
			this.text += "<p>" + text + "</p>";
		}else{
			this.text += text;
		}
		this.textUpdate();
	},
}
con.textAppend("Type 'help' for available functions", true);

window.onkeypress = function(e){
	var key = e.keyCode;
	switch(key){
		case 8:
		case 13:
		break;
		default:
			con.commandAppend(key);
		break;
	}
}

window.onkeydown = function(e){
	var key = e.keyCode;
	if(key === 8){
		con.commandErase();
		e.preventDefault();
	}else if(key === 13){
		con.commandSend(con.command);
		e.preventDefault();
	}
}