/* ####################################################################################################### */

// Došlić :

var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var staff_button = document.querySelector('.staff');

/* ####################################################################################################### */

const ipc = require('electron').ipcRenderer;    // IPC za komunikaciju sa glavnim "enginom"

/* ####################################################################################################### */

edn_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_ednevnik');
});

sett_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_settings');
})

tms_button.addEventListener('click', () => {
    ipc.send('op_teams');
})

ymr_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_yammer');
})

staff_button.addEventListener('click', () => {
    ipc.send('op_staff');
})

/* ####################################################################################################### */