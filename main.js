// Main file that does most inmportant things in the project

// Osnovne varijable za stvaranje prozora, prikaza web sučelja i electron
const {app, BrowserWindow, BrowserView, electron, session} = require('electron')
const url = require("url");
const path = require("path");
const shell = require('electron').shell;
require('jquery');

/* ####################################################################################################### */

// Window aplikacije i prikaz svih vanjskih sučelja poput teams, word...
let mainWindow;
let prikaz;

/* ####################################################################################################### */

// Funkcija za stvaranje prozora prva se pokreće kad je aplikacija spremna
function createWindow () {
    session.defaultSession.webRequest.onBeforeSendHeaders((detalis, callback) => {
        detalis.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
        callback({cancel: false, requestHeaders: detalis.requestHeaders});
    });

    mainWindow = new BrowserWindow({    // Deklariranje glavnog prozora
    webPreferences: {
        nodeIntegration: true           // Postavljanje nodeIntegration u true, just don't ask I am sick of it
    },
    show: false                         // Pri samom pokretanju prozor se ne prikazuje dok se ne učitaju neke stvari
    })
    mainWindow.maximize();              // Automatski se maksimizira prozor

    var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
    
    prikaz = new BrowserView(           // Deklaracija prikaza koji prikazuje vanjske sadržaje
        {webPreferences: {
            nodeIntegration:false,
            contextIsolation: true,
            enableRemoteModule: true,
            experimentalFeatures: true,
            enableBlinkFeatures: 'ExecCommandInJavaScript', 
            webSecurity: false
        }});

    mainWindow.webContents.setUserAgent(userAgent)
    prikaz.webContents.setUserAgent(userAgent);

    mainWindow.addBrowserView(prikaz);                              // Ubacivanje prikaza u glavni prozor
    prikaz.setBounds({ x: 80, y: 50, width: 1280, height: 720 });   // Postaljanje pozicije i rezolucije prikaza u glavnom prozoru
    prikaz.webContents.loadURL('https://teams.microsoft.com');               // URL koji prikaz učitava u ovom slučaju office.com

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'm_inf/index.html'),
            protocol: "file:",                                      // Ovaj dio učitava naše sučelje u glavni prozor
            slashes: true
        })
        );

    mainWindow.webContents.on('ready', () => {
        mainWindow.show();                                          // Kad se neke stvari učitaju prikaže se prozor
    })

    mainWindow.on('closed', function () {
        mainWindow = null                                               // Kad sve prestane s radom glavni prozor postaje null
    })                                                              // kako aplikacija nebi nastavila raditi u pozadini
}

app.on('ready', createWindow)                       // Kad je aplikacija spremna pokreće se stvaranje prozora

/* ####################################################################################################### */

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
                                                    // Ovaj dio je za mac os i linux verzije aplikacije
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

/* ####################################################################################################### */

const ipc = require('electron').ipcMain;        // IPC (Inter-Process Comunication) koristi se za komunikaciju procesa
const remote = require('electron').remote;      // unutar aplikacije ovo je IPC.main koji prima sve zahtjeve ostalih IPC
let program_win;
let program_win_opened = false;

/* ####################################################################################################### */

ipc.on('op_ednevnik', () => {
    prikaz.webContents.loadURL('https://ocjene.skole.hr');  // Prinicp svakog 'op' zahtjeva je isti prikaz ucita potreban
});                                                         // URL ovisno o buttonu koji je stisnut

ipc.on('op_settings', () => {
    dialog.showMessageBox(null, {
        type: 'info',
        defaultId: 2,
        title: 'Settings Unavailable!',
        message: 'Settings are not yet avaliable!',
        detail: 'There is nothing to do in settings yet.'
    });
});

ipc.on('op_teams', () => {
    prikaz.webContents.loadURL('https://teams.microsoft.com');
})

ipc.on('op_tasks', () => {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'my_tasks/index.html'),
            protocol: "file:",                                     
            slashes: true
        })
        );
    mainWindow.removeBrowserView(prikaz);
});

ipc.on('op_yammer', () => {
    prikaz.webContents.loadURL('https://yammer.com');
});

ipc.on('op_gmail', () => {
    if(!program_win_opened){
        program_win = new BrowserWindow({
            parent: mainWindow,
            frame: true,
            webPreferences:{
                  nodeIntegration: false,
                  contextIsolation: true
                },
            resizable: false,
            width: 1280,
            height: 720
        });
        program_win.loadURL('https://mail.google.com', {userAgent: 'Chrome'})
        program_win.on('closed', () => {
            program_win = null;
            program_win_opened = false;
        });
        program_win_opened = true;
    }
});

ipc.on('op_word', () => {
    shell.openExternal('https://www.office.com/launch/word');
});

ipc.on('op_powerpoint', () => {
    shell.openExternal('https://www.office.com/launch/powerpoint');
});

ipc.on('op_excel', () => {
    shell.openExternal('https://www.office.com/launch/excel');
});

ipc.on('op_cloud', () => {
    prikaz.webContents.loadURL('https://onedrive.live.com');
});

ipc.on('op_mainwin', () => {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'm_inf/index.html'),
            protocol: "file:",
            slashes: true
        })
        );

    mainWindow.addBrowserView(prikaz);
    prikaz.setBounds({ x: 80, y: 50, width: 1280, height: 720 });
})

ipc.on('op_tools', () => {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'my_tools/index.html'),
            protocol: "file:",                                     
            slashes: true
        })
        );
    mainWindow.removeBrowserView(prikaz);
})

/* ####################################################################################################### */
// Ovaj dio je za testiranje novih stvari koje trebaju IPC komunikaciju!

ipc.on('test', () => {
    console.log("TEST 1 2 3");
    console.log("TEST 3 2 1");
})

/* ####################################################################################################### */
// Otvaranje i zatvaranje prozora za stvaranje zadataka

let taskWinOpened = false;
let taskWin;

ipc.on('open_task_creation', () => {
    if(!taskWinOpened){
        taskWin = new BrowserWindow({
            parent: mainWindow,
            frame: false,
            webPreferences:{
                  nodeIntegration: true
                },
            resizable: false,
            width: 480,
            height: 660
            });
        taskWin.loadURL(
            url.format({
                pathname: path.join(__dirname, 'my_tasks/popup_win/form.html'),
                protocol: "file:",
                slashes: true
            })
        );
        taskWin.on('closed', () => {
            taskWin = null;
            taskWinOpened = false;
        });
        
        taskWinOpened = true;
    }
});

ipc.on('reload-req', (e, request_number) => {
    taskWin.close();
    if(request_number === 0){
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'my_tasks/index.html'),
                protocol: "file:",                                     
                slashes: true
            })
            );
    } else if(request_number === 1){
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'staff/index.html'),
                protocol: "file:",                                     
                slashes: true
            })
            );
    } else if(request_number === 2){
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'my_tools/index.html'),
                protocol: "file:",                                     
                slashes: true
            })
            );
    }
    
});

/* ####################################################################################################### */

// Otvaranje i zatvaranje prozora zadatka

const renderer = require('electron').ipcRenderer;
const { dialog } = require('electron/main');

let lastView = 'https://mail.google.com';

let taskSolvingWinOpened = false;
let taskSolvingWin;
let taskSolvingView;
let lastTaskTitle;

ipc.on('create_task_win', (e, title) => {
    if(!taskSolvingWinOpened){
        lastTaskTitle = title;
        taskSolvingWin = new BrowserWindow({
            parent: mainWindow,
            width: 1280,
            height: 720,
            webPreferences:{nodeIntegration: true}
        });

        taskSolvingWin.loadURL(
            url.format({
                pathname: path.join(__dirname, 'my_tasks/task_win/index.html'),
                protocol: "file:",
                slashes: true
            })
        );

        taskSolvingView = new BrowserView({
            webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            webSecurity: false, 
            javascript:true,
            contextIsolation: true
        }});

        taskSolvingWin.addBrowserView(taskSolvingView);
        taskSolvingView.setBounds({ x: 0, y: 161, width: 1276, height: 463 });
        taskSolvingView.setAutoResize({ width: true, height: false}); 
        taskSolvingView.webContents.loadURL('https://mail.google.com', {userAgent: 'Chrome'});

        taskSolvingWin.on('closed', () => {
            taskSolvingWin = null;
            taskSolvingWinOpened = false;
        });

        taskSolvingWinOpened = true;
    }
});

ipc.on("content_request", (e, arg) => {
    console.log(arg);
    e.returnValue = lastTaskTitle;
})

ipc.on("disable_task_view", () => {
    taskSolvingWin.removeBrowserView(taskSolvingView);
})

ipc.on("enable_task_view", () => {
    taskSolvingWin.addBrowserView(taskSolvingView);
    taskSolvingView.setBounds({ x: 0, y: 161, width: 1276, height: 463 });
    taskSolvingView.setAutoResize({ width: true, height: false}); 
    taskSolvingView.webContents.loadURL(lastView, {userAgent: 'Chrome'});
})

ipc.on("op_gmail_view", () => {
    taskSolvingView.webContents.loadURL('https://mail.google.com', {userAgent: 'Chrome'});
    lastView = 'https://mail.google.com';
})

ipc.on("op_webmail_view", () => {
    taskSolvingView.webContents.loadURL('https://webmail.carnet.hr');
    lastView = 'https://webmail.carnet.hr';
})

/* ####################################################################################################### */

// Otvaranje staff prozora

ipc.on('op_staff', () => {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'staff/index.html'),
            protocol: "file:",                                     
            slashes: true
        })
        );

    mainWindow.removeBrowserView(prikaz);
})

/* ####################################################################################################### */

// Staff - Add Professor win

ipc.on('op_professor_addwin', () => {
    if(!taskWinOpened){
        taskWin = new BrowserWindow({
            parent: mainWindow,
            webPreferences:{
                nodeIntegration: true
            },
            frame: false,
            width: 480,
            height: 535
        });
        taskWin.loadURL(
            url.format({
                pathname: path.join(__dirname, 'staff/popup_win/form.html'),
                protocol: "file:",
                slashes: true
            })
        );
        taskWin.on('closed', () => {
            taskWin = null;
            taskWinOpened = false;
        });
        taskWinOpened = true;
    }
})

/* ####################################################################################################### */

// MyTools - Add tool win

ipc.on('op_tools_adder', () => {
    if(!taskWinOpened){
        taskWin = new BrowserWindow({
            parent: mainWindow,
            webPreferences:{
                nodeIntegration: true,
                enableRemoteModule: true
            },
            frame: false,
            width: 480,
            height: 535
        });
        taskWin.loadURL(
            url.format({
                pathname: path.join(__dirname, 'my_tools/add_win/index.html'),
                protocol: "file:",
                slashes: true
            })
        );
        taskWin.on('closed', () => {
            taskWin = null;
            taskWinOpened = false;
        });
        taskWinOpened = true;
    }
})

/* ####################################################################################################### */

// eDnevnik connect

let connectWin;
let connectWinOpened = false;

ipc.on('connect_ednevnik', () => {
    if(!connectWinOpened){
        connectWin = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences:{
                nodeIntegration: true
            }
        });

        connectWin.loadURL(
            url.format({
                pathname: path.join(__dirname, 'staff/connect/form.html'),
                protocol: "file:",
                slashes: true
            })
        );

        connectWin.on('close', () => {
            connectWin = null;
            connectWinOpened = false;
        });

        connectWinOpened = true;
    }
})

ipc.on('reload-req-conn', () => {
    connectWin.close();
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'staff/index.html'),
            protocol: "file:",                                     
            slashes: true
        })
        );
})