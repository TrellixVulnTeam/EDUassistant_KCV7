/* OUTDATED removing in next patch

//Babić : (Babiću komentiraj svoj dio da mi znamo ak budeš još šta radio u java scriptu oko nav bara)

function navSlide() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
                                                            // komentar
    burger.addEventListener("click", () => {
        nav.classList.toggle("nav-active");
    });
}
*/
/* ####################################################################################################### */
/*
navSlide();     // komentar
*/
/* ####################################################################################################### */

// Došlić :

var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var tasks_button = document.querySelector('.tasks');
var staff_button = document.querySelector('.staff');
var tools_button = document.querySelector('.tools');


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