const ipc = require('electron').ipcRenderer;

const op_gmail_btn = document.getElementById("GmailBtn");
const op_webmail_btn = document.getElementById("WebmailBtn");

// Varijable koje treba dobit:

let win_title = document.getElementById("win_title");
let title_element = document.getElementById("title");
let rok = document.getElementById("rok");
let predmet = document.getElementById("predmet");
let profesor = document.getElementById("profesor");
let tip = document.getElementById("tip");

op_gmail_btn.addEventListener('click', () => {
    ipc.send("op_gmail");
});

op_webmail_btn.addEventListener('click', () => {
    return;
});

title = ipc.sendSync("content_request", "received");

function onLoad(){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(task => {
        if(title === task.TaskTitle){
            win_title.innerHTML = task.TaskTitle;
            title_element.innerHTML = task.TaskTitle;
            rok.innerHTML = "Rok: "+task.TaskDate;
            predmet.innerHTML = "Predmet: "+task.TaskSubject;
            profesor.innerHTML = "Profesor: "+task.TaskProfessor;
            tip.innerHTML = "Tip: "+task.TaskType;
        }
    });

}

onLoad();