const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;

const op_gmail_btn = document.getElementById("GmailBtn");
const op_webmail_btn = document.getElementById("WebmailBtn");

// Varijable koje treba dobit:

let win_title = document.getElementById("win_title");
let title_element = document.getElementById("title");
let rok = document.getElementById("rok");
let predmet = document.getElementById("predmet");
let profesor = document.getElementById("profesor");
let tip = document.getElementById("tip");

var dropdown = document.getElementById("tools_list");

let profesor_public;
let mail_text = document.getElementById('mail_text');
let teams_text = document.getElementById('teams_text');

op_gmail_btn.addEventListener('click', () => {
    ipc.send("op_gmail_view");
});

op_webmail_btn.addEventListener('click', () => {
    ipc.send("op_webmail_view");
});

title = ipc.sendSync("content_request", "received");

function onLoad(){
    // Task decription part
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

            profesor_public = task.TaskProfessor;
        }
    });

    // Contact info part
    let professors;
    if(localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'))
    }

    professors.forEach(professor => {
        if(profesor_public === professor.Name){
            mail_text.innerHTML = professor.Email;
            teams_text.innerHTML = professor.Teams;
        }
    })

    let tools;

    if(localStorage.getItem('tools') === null){
        tools = [];
    } else {
        tools = JSON.parse(localStorage.getItem('tools'));
    }

    tools.forEach(tool => {
        addToDrop(tool.name, tool.path);
    })

}

onLoad();

// Copy to clipboard code

title_copybtn = document.getElementById("title_cpy");
mail_copybtn = document.getElementById("mail_cpy");

title_copybtn.addEventListener('click', () => {
    var el = document.createElement('textarea');
    el.value = title;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
});

mail_copybtn.addEventListener('click', () => {
    var el = document.createElement('textarea');
    el.value = mail_text.innerHTML;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
});

// Button icons

var powerpoint = document.getElementById("ppt");
var word = document.getElementById("wrd");
var excel = document.getElementById("xcl");
var mytools = document.getElementById("mytools");

let viewon = true;

powerpoint.addEventListener('click', () => {
    ipc.send('op_powerpoint');
})

word.addEventListener('click', () => {
    ipc.send('op_word');
})

excel.addEventListener('click', () => {
    ipc.send('op_excel');
})

mytools.addEventListener('click', () => {
    dropdown.classList.toggle("show");
    if(viewon){
        ipc.send("disable_task_view");
        viewon = false;
    } else {
        ipc.send("enable_task_view");
        viewon = true;
    }
})

function addToDrop(name, path){
    var a = document.createElement('a');
    var aTxt = document.createTextNode(name);

    a.appendChild(aTxt);

    a.addEventListener('click', () => {
        shell.openPath(path);
        dropdown.classList.toggle("show");
        ipc.send("enable_task_view");
    });

    dropdown.appendChild(a);
}