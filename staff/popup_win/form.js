const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
var nameField = document.getElementById('name');
var subjectField = document.getElementById('subject');
var emailField = document.getElementById('email');
var teamsField = document.getElementById('teams');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');

submitButton.addEventListener('click', () => {
    var name = nameField.value;
    var subject = subjectField.value;
    var email = emailField.value;
    var teams = teamsField.value;

    var professor = {
        Name: name,
        Subject: subject,
        Email: email,
        Teams: teams
    };

    let professors;

    if (localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'));
    }

    professors.push(professor);

    localStorage.setItem('professors', JSON.stringify(professors));

    ipc.send('reload-req', 1);
});

exit.addEventListener('click', () => {
    ipc.send('reload-req', 1);
});