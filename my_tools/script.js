const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;

var add_tool = document.getElementById('add_tool');
var word_button = document.getElementById('word');
var powerpoint_button = document.getElementById('powerpoint');
var excel_button = document.getElementById('excel');
var gmail_button = document.getElementById('gmail');
var tool_space = document.getElementById('tool_space');

add_tool.addEventListener('click', () => {
    ipc.send("op_tools_adder");
})

word_button.addEventListener('click', () => {
    ipc.send("op_word");
})

powerpoint_button.addEventListener('click', () => {
    ipc.send("op_powerpoint");
})

excel_button.addEventListener('click', () => {
    ipc.send("op_excel");
})

gmail_button.addEventListener('click', () => {
    ipc.send("op_gmail");
})

function create_tool(name, path){
    var card = document.createElement('div');
    card.classList.add('card');

    var title = document.createElement('a');
    var titleTxt = document.createTextNode(name);
    title.appendChild(titleTxt);

    card.appendChild(title);

    var ico = document.createElement('img');
    ico.setAttribute("src", "icons/tool_place_holder_def.png");

    card.appendChild(ico);

    card.addEventListener('click', () => {
        shell.openPath(path);
    })

    tool_space.removeChild(add_tool);
    tool_space.appendChild(card);
    tool_space.appendChild(add_tool);
}

function onLoad(){
    let tools;

    if(localStorage.getItem('tools') === null){
        tools = [];
    } else {
        tools = JSON.parse(localStorage.getItem('tools'));
    }

    tools.forEach(tool => {
        create_tool(tool.name, tool.path);
    })
}

onLoad();


/* ####################################################################################################### */

// Menu Part

var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var tasks_button = document.querySelector('.tasks');
var staff_button = document.querySelector('.staff');

/* ####################################################################################################### */

edn_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_ednevnik');
});

sett_button.addEventListener('click', () => {
    ipc.send('op_settings');
})

tms_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_teams');
})

ymr_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_yammer');
})

tasks_button.addEventListener('click', () => {
    ipc.send('op_tasks');
})

staff_button.addEventListener('click', () => {
    ipc.send('op_staff');
})

/* ####################################################################################################### */

// Frame

const BrowserWindow = require('electron').remote;

document.getElementById("min-btn").addEventListener("click", () => {
    var win = BrowserWindow.getCurrentWindow();
    win.minimize(); 
});

document.getElementById("close-btn").addEventListener("click", () => {
    var win = BrowserWindow.getCurrentWindow();
    win.close();
}); 

