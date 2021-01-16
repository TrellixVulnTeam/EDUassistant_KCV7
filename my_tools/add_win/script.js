const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const path = require('path');
var dialog = remote.require('electron').dialog;

var tool_path;

var search_btn = document.getElementById("search_btn");
var submit = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');
var tool_name;

search_btn.addEventListener('click', () => {
    tool_path = dialog.showOpenDialogSync({
        properties: ['openFile']
    });

    console.log(tool_path);
    var dir = tool_path[0].split(path.sep);
    search_btn.innerHTML = dir[dir.length-1];    
    tool_name = search_btn.innerHTML.replace(/\.[^/.]+$/, "");
    search_btn.blur();
})

function submitInfo(){
    var tool = {
        name: tool_name,
        path: tool_path[0]
    }

    let tools;

    if(localStorage.getItem('tools') === null){
        tools = [];
    } else {
        tools = JSON.parse(localStorage.getItem('tools'));
    }

    tools.push(tool);

    localStorage.setItem('tools', JSON.stringify(tools));

    ipc.send('reload-req', 2);
}

exit.addEventListener('click', () => {
    ipc.send('reload-req', 2);
});

submit.addEventListener('click', submitInfo);

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
      submitInfo();
    }
  });