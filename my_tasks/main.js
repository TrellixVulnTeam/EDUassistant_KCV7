var button = document.getElementById("create-task");
var taskSect = document.getElementsByClassName('tasks-section');
var zadaci = document.getElementsByClassName('card');

const ipc = require('electron').ipcRenderer;
const ipcM = require('electron').ipcMain;

button.addEventListener('click', () => {
    ipc.send('open_task_creation');
});

function createTask(title, subject, dateValue, professor, type){
    var article = document.createElement("article");
    article.classList.add("card");

    var header = document.createElement("header");
    header.classList.add("card-header");
    article.appendChild(header);
    
    var date = document.createElement("p");
    header.appendChild(date);

    var dateTxt = document.createTextNode(dateValue);
    date.appendChild(dateTxt);
    
    var opis = document.createElement("h2");
    opis.classList.add("task-title");
    header.appendChild(opis);

    var opisTxt = document.createTextNode(title);
    opis.appendChild(opisTxt);

    var author = document.createElement("div");
    author.classList.add("card-author");
    article.appendChild(author);

    var slikaA = document.createElement("a");
    slikaA.classList.add("author-avatar");
    author.appendChild(slikaA);

    var slika = document.createElement("img");
    slika.setAttribute("src", "icons/avatar.jpg");
    slikaA.appendChild(slika);

    var svg = document.createElement("svg");
    svg.classList.add("half-circle");
    svg.setAttribute("viewBox", "0 0 106 57");
    author.appendChild(svg);

    path = document.createElement("path");
    path.setAttribute("d", "M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4");
    svg.appendChild(path);

    var name = document.createElement("div");
    name.classList.add("author-name");
    article.appendChild(name);

    var prefix = document.createElement("div");
    prefix.classList.add("author-name-prefix");
    name.appendChild(prefix);

    var nameTxt = document.createTextNode(professor);
    name.appendChild(nameTxt);

    var prefixTxt = document.createTextNode("Professor");
    prefix.appendChild(prefixTxt);

    var tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    article.appendChild(tagsDiv);

    var predmet = document.createElement('a');
    var predmetTxt = document.createTextNode(subject);
    predmet.appendChild(predmetTxt);

    tagsDiv.appendChild(predmet);

    var tip = document.createElement('a');
    var tipTxt = document.createTextNode(type);
    tip.appendChild(tipTxt);

    tagsDiv.appendChild(tip);

    var deleteButt = document.createElement('img');
    deleteButt.classList.add('delete-button');
    deleteButt.setAttribute("src", "icons/x.png");
    deleteButt.setAttribute("task-title", title);
    deleteButt.addEventListener('click', deleteTask);
    tagsDiv.appendChild(deleteButt);

    opis.setAttribute("task-title", title);
    opis.addEventListener('click', openTaksWin);

    document.getElementById("card-place").appendChild(article);
};

function deleteTask(e){
    if(confirm('Are you sure you want to delete this task?')){
        deleteFromLS(e.target.getAttribute("task-title"));
        e.currentTarget.parentNode.parentNode.remove();
    }
}

function openTaksWin(e){
    ipc.send('create_task_win', e.target.getAttribute("task-title"));
}


function onLoad(){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(task => {
        createTask(task.TaskTitle, task.TaskSubject, task.TaskDate, task.TaskProfessor, task.TaskType);
    });
}

function deleteFromLS(taskItem){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem === task.TaskTitle){
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

onLoad();

// Menu part

var edn_button  = document.querySelector('.ednevnik');
var tms_button  = document.querySelector('.teams');
var ymr_button  = document.querySelector('.yammer');
var sett_button = document.querySelector('.settings');
var staff_button = document.querySelector('.staff');

edn_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_ednevnik');
});

sett_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
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

staff_button.addEventListener('click', () => {
    ipc.send('op_mainwin');
    ipc.send('op_staff');
})