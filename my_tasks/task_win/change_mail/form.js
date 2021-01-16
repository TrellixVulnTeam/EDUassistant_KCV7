const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
ipc = require('electron').ipcRenderer;
var mailField = document.getElementById('mail');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');
var prof = ipc.sendSync('req_for_mail_name');

submitButton.addEventListener('click', submitInfo);

function submitInfo(){
    var mail = mailField.value;

    let professors;

    if (localStorage.getItem('professors') === null){
        professors = [];
    } else {
        professors = JSON.parse(localStorage.getItem('professors'));
    }

    professors.forEach(professor => {
        if(prof === professor.Name){
            professor.Email = mail;
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