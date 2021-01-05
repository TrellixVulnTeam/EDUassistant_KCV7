const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
ipc = require('electron').ipcRenderer;
var titleField = document.getElementById('title');
var subjectField = document.getElementById('subject');
var dateField = document.getElementById('date');
var professorField = document.getElementById('professor');
var typeField = document.getElementById('type');
var submitButton = document.getElementById('submit_btn');

submitButton.addEventListener('click', () => {
    var title = titleField.value;
    var subject = subjectField.value;
    var date = dateField.value;
    var professor = professorField.value;
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

    ipc.send('reload-req');
});