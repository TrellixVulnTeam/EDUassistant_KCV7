const { setSyntheticTrailingComments } = require('typescript');

const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const {PythonShell} = require('python-shell');
var emailField = document.getElementById('mail');
var passwordField = document.getElementById('password');
var submitButton = document.getElementById('submit_btn');
var exit = document.getElementById('exit_btn');

submitButton.addEventListener('click', () => {
    var email = emailField.value;
    var password = passwordField.value;

    let options = {
        mode: "json",
        pythonPath: "resources/app/python/python.exe",
        scriptPath: "resources/app/staff/connect/",
        args: [email, password]
    }

    PythonShell.run('get-professors.py', options, function(err, results){
        if(err) throw err;
        const getRes = async() => {
            return results[0];
        }

        const gatherList = async() => {
            const res = await getRes();
            localStorage.setItem('professors', JSON.stringify(res));
            return res;
        }

        const refRequest = async() => {
            const waiter = await gatherList();
            ipc.send('reload-req-conn');
        }

        refRequest();
    });

    
});

exit.addEventListener('click', () => {
    ipc.send('reload-req-conn');
});