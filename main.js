/* ######################################### MAIN ENGINE ##################################################
 *
 * Ovaj file stvara prozor i odrađuje glavne funkcije u radu sa electronom
 * sadrži glavni IPC.main koji prima zahtjeve od drugih .js fileova i izvršava
 * radnje na najvišem nivou. Nemojte mi puno drkat po ovome ovo je više sensitive
 * od cure u pubertetu koja ima menstruaciju.
 * 
 *                                                                                    - Doktor
 */
/* ####################################################################################################### */

// Osnovne varijable za stvaranje prozora, prikaza web sučelja i electron
const {app, BrowserWindow, BrowserView, electron} = require('electron')
const url = require("url");
const path = require("path");
const shell = require('electron').shell;
require('jquery');
require('@angular-devkit/build-angular');
require('morgan');
require('@angular/cli');

/* ####################################################################################################### */

// Window aplikacije i prikaz svih vanjskih sučelja poput teams, word...
let mainWindow;
let prikaz;

/* ####################################################################################################### */

// Funkcija za stvaranje prozora prva se pokreće kad je aplikacija spremna
function createWindow () {
    mainWindow = new BrowserWindow({    // Deklariranje glavnog prozora
    webPreferences: {
        nodeIntegration: true           // Postavljanje nodeIntegration u true, just don't ask I am sick of it
    },
    show: false                         // Pri samom pokretanju prozor se ne prikazuje dok se ne učitaju neke stvari
    })
    mainWindow.maximize();              // Automatski se maksimizira prozor

    prikaz = new BrowserView(           // Deklaracija prikaza koji prikazuje vanjske sadržaje
        {webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            webSecurity: false,         // Neophodne gluposti da prikaz radi kako spada
            javascript:true,
            contextIsolation: true
        }});

    prikaz.require = require('jquery');                             // Prikaz zahtjeva jquery kako bi radio
    prikaz.require = require('@angular-devkit/build-angular');      // Prikaz zahtjeva angular kako bi radio
    prikaz.require = require('express');                            // Većina aplikacija stvorena je s pomoću angulara,
    prikaz.require = require('morgan');                             // a jquery se koristi na serverima istražite ako vas zanima

    mainWindow.addBrowserView(prikaz);                              // Ubacivanje prikaza u glavni prozor
    prikaz.setBounds({ x: 80, y: 50, width: 1280, height: 720 });   // Postaljanje pozicije i rezolucije prikaza u glavnom prozoru
    prikaz.webContents.loadURL('https://office.com');               // URL koji prikaz učitava u ovom slučaju office.com

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

/* ####################################################################################################### */

ipc.on('op_ednevnik', () => {
    prikaz.webContents.loadURL('https://ocjene.skole.hr');  // Prinicp svakog 'op' zahtjeva je isti prikaz ucita potreban
});                                                         // URL ovisno o buttonu koji je stisnut

ipc.on('op_settings', () => {
    console.log("Settings unavailable at the time!");
});

ipc.on('op_teams', () => {
    shell.openPath('C:/Users/Windows 10/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Microsoft Teams.lnk');
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
    //prikaz.webContents.loadURL(' HERE THE URL TO THE .EXE FILE WILL BE PUT ');
});

ipc.on('op_gmail', () => {
    prikaz.webContents.loadURL('https://mail.google.com');
});

ipc.on('op_word', () => {
    prikaz.webContents.loadURL('https://www.office.com/launch/word');
});

ipc.on('op_powerpoint', () => {
    prikaz.webContents.loadURL('https://www.office.com/launch/powerpoint');
});

ipc.on('op_excel', () => {
    prikaz.webContents.loadURL('https://www.office.com/launch/excel');
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
    }
    
});

/* ####################################################################################################### */

// Otvaranje i zatvaranje prozora zadatka

const renderer = require('electron').ipcRenderer;

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
        taskSolvingView.webContents.loadURL('https://mail.google.com');

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