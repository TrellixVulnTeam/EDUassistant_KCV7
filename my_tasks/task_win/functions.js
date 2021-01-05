const ipc = require('electron').ipcRenderer;

const op_gmail_btn = document.getElementById("GmailBtn");
const op_webmail_btn = document.getElementById("WebmailBtn");

op_gmail_btn.addEventListener('click', () => {
    ipc.send("op_gmail");
})

op_webmail_btn.addEventListener('click', () => {
    ipc.send("op_webmail");
})