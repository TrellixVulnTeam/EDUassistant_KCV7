/* ####################################################################################################### */

// Došlić :

var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var tasks_button = document.querySelector('.tasks');
var tools_button = document.querySelector('.tools');

/* ####################################################################################################### */

const ipc = require('electron').ipcRenderer;    // IPC za komunikaciju sa glavnim "enginom"

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

tools_button.addEventListener('click', () => {
    ipc.send('op_tools');
})

/* ####################################################################################################### */

// Staff stuff

var add_button = document.getElementById("add_btn");
var professor_list = document.getElementById("popis");

add_button.addEventListener('click', () => {
    ipc.send('op_professor_addwin');
});

function createProff(name){
    var nameSpace = document.createElement('li');

    var profileImg = document.createElement('img');
    profileImg.setAttribute("src", "icons/prof_ico.png");
    
    var nameTxt = document.createTextNode(name);
    
    nameSpace.setAttribute("prof-name", name);
    nameSpace.appendChild(profileImg);
    nameSpace.appendChild(nameTxt);

    /*nameSpace.addEventListener('click', () => {
        ipc.send('op_profdet');
    });*/ // COMMING SOON!
    
    professor_list.appendChild(nameSpace);
}

function onLoad(){
    let professors;

    if (localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'));
    }

    professors.forEach(professor => {
        createProff(professor.Name);
    });
}

onLoad();

// Connect eDnevnik

var connectBtn = document.getElementById('connect_ed');

connectBtn.addEventListener('click', () => {
    ipc.send('connect_ednevnik');
})