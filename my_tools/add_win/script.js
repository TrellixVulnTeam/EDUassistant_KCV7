const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const path = require('path');
var dialog = remote.require('electron').dialog;

var tool_path;

var name_space = document.getElementById("name");
var search_btn = document.getElementById("search_btn");
var submit = document.getElementById('submit_btn');

search_btn.addEventListener('click', () => {
    tool_path = dialog.showOpenDialogSync({
        properties: ['openFile']
    });

    console.log(tool_path);
    var dir = tool_path[0].split(path.sep);
    search_btn.innerHTML = dir[dir.length-1];
})

submit.addEventListener('click', () => {
    var tool = {
        name: name_space.value,
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
})
