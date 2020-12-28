//Babić : (Babiću komentiraj svoj dio da mi znamo ak budeš još šta radio u java scriptu oko nav bara)

function navSlide() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
                                                            // komentar
    burger.addEventListener("click", () => {
        nav.classList.toggle("nav-active");
    });
}

/* ####################################################################################################### */

navSlide();     // komentar

/* ####################################################################################################### */

// Došlić :

var edn_button  = document.querySelector('.ednevnik');
var sett_button = document.querySelector('.postavke');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var gml_button  = document.querySelector('.gmail');             // Poprilično je jasno što je ovo
var wrd_button  = document.querySelector('.word');
var ppt_button  = document.querySelector('.powerpoint');
var xcl_button  = document.querySelector('.excel');
var cld_button  = document.querySelector('.cloud');

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

gml_button.addEventListener('click', () => {
    ipc.send('op_gmail');
})

wrd_button.addEventListener('click', () => {
    ipc.send('op_word');                                            // Funkcija Word tipke
})

ppt_button.addEventListener('click', () => {
    ipc.send('op_powerpoint');
})

xcl_button.addEventListener('click', () => {
    ipc.send('op_excel');
})

cld_button.addEventListener('click', () => {
    ipc.send('op_cloud');
})

/* ####################################################################################################### */