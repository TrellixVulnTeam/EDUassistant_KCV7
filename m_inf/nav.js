var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var tasks_button = document.querySelector('.tasks');
var staff_button = document.querySelector('.staff');
var tools_button = document.querySelector('.tools');
var quick_add  = document.querySelector('.qucik_add_task');


/* ####################################################################################################### */

const ipc = require('electron').ipcRenderer;    // IPC za komunikaciju sa glavnim "enginom"

/* ####################################################################################################### */

edn_button.addEventListener('click', () => {
    ipc.send('op_ednevnik');
});

sett_button.addEventListener('click', () => {
    ipc.send('op_settings');
})

tms_button.addEventListener('click', () => {
    ipc.send('op_teams');
})

ymr_button.addEventListener('click', () => {
    ipc.send('op_yammer');
})

staff_button.addEventListener('click', () => {
    ipc.send('op_staff');
})

tasks_button.addEventListener('click', () => {
    ipc.send('op_tasks');
})

tools_button.addEventListener('click', () => {
    ipc.send('op_tools');
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

/* ####################################################################################################### */

// Quick add task

quick_add.addEventListener('click', () => {
    ipc.send('open_task_creation', "yes");
})