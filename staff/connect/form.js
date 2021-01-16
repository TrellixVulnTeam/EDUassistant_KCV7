const { setSyntheticTrailingComments } = require('typescript');

const {dialog} = require('electron/main');
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const {PythonShell} = require('python-shell');
const path = require('path');
const { warn } = require('console');
var emailField = document.getElementById('mail');
var passwordField = document.getElementById('password');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');
var pathToPython = getPyPath();
var pathToScript = getScPath();

function submitInfo() {
    var email = emailField.value;
    var password = passwordField.value;

    let options = {
        mode: "json",
        pythonPath: pathToPython,
        scriptPath: pathToScript,
        args: [email, password]
    }

    PythonShell.run('get-professors.py', options, function(err, results){
        if(err) throw err;
        const getRes = async() => {
            return results[0];
        }

        const gatherList = async() => {
            const res = await getRes();
            if(res.length > 0){
                localStorage.setItem('professors', JSON.stringify(res));
                return res;
            } else {
                alert("Nešto ne štima. Pokušaj opet!");
            }
        }

        const refRequest = async() => {
            const waiter = await gatherList();
            ipc.send('reload-req-conn');
        }

        refRequest();
    });   
}

exit.addEventListener('click', () => {
    ipc.send('reload-req-conn');
});

submitButton.addEventListener('click', submitInfo);

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
      submitInfo();
    }
  });

function getPyPath(){
    let directory = __dirname.split(path.sep);;
    directory.splice(-1, 1);
    directory.splice(-1, 1);
    let pTp = directory.join(path.sep) + path.sep + 'python' + path.sep + 'python.exe';
    return pTp;
}

function getScPath(){
    let directory = __dirname.split(path.sep);;
    directory.splice(-1, 1);
    directory.splice(-1, 1);
    let pTs = directory.join(path.sep) + path.sep + 'staff' + path.sep + 'connect';
    return pTs;
}