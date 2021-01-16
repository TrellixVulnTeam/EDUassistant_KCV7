const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
ipc = require('electron').ipcRenderer;
var teamsField = document.getElementById('teams');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');
var prof = ipc.sendSync('req_for_teams_name');

submitButton.addEventListener('click', submitInfo);

function submitInfo(){
    var teams = teamsField.value;

    let professors;

    if (localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'));
    }

    professors.forEach(professor => {
        if(prof === professor.Name){
            professor.Teams = teams;
        }
    })

    localStorage.setItem('professors', JSON.stringify(professors));

    ipc.send('close_change');
    
}

// Keyboard enter submists

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
      submitInfo();
    }
});

exit.addEventListener('click', () => {
    ipc.send('close_change');
});