const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
ipc = require('electron').ipcRenderer;
var titleField = document.getElementById('title');
var subjectField = document.getElementById('subject');
var dateField = document.getElementById('date');
var typeField = document.getElementById('type');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');
var is_from_teams = ipc.sendSync('is_started_from_teams');

submitButton.addEventListener('click', submitInfo);

function submitInfo(){
    var title = titleField.value;
    var subject = subjectField.value;
    var date = dateField.value;
    var professor = prof_button.innerHTML;
    var type = typeField.value;

    var task = {
        TaskTitle: title,
        TaskSubject: subject,
        TaskDate: date,
        TaskProfessor: professor,
        TaskType: type
    };

    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    if(is_from_teams){
        ipc.send('reload-req', 99);
    } else {
        ipc.send('reload-req', 0);
    }
    
}

// Drop Down Part

var prof_button = document.getElementById("show_professors");

prof_button.addEventListener('click', () => {
    document.getElementById("lista_profesora").classList.toggle("show");
})

function itemSelected(e) {
    prof_button.innerHTML = e.target.innerHTML;
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

// Putting Professors into dropdown

function addToDropDown(name){
    var nameSpace = document.createElement('a');

    var nameTxt = document.createTextNode(name);

    nameSpace.appendChild(nameTxt);
    nameSpace.addEventListener('click', itemSelected);

    document.getElementById("lista_profesora").appendChild(nameSpace);
}

function onLoad(){
    let professors;

    if (localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'));
    }

    professors.forEach(professor => {
        addToDropDown(professor.Name);
    });
}

onLoad();

exit.addEventListener('click', () => {
    if(is_from_teams){
        ipc.send('reload-req', 99);
    } else {
        ipc.send('reload-req', 0);
    }
});

// Keyboard enter submists

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
      submitInfo();
    }
  });