const {
  ipcRenderer,
  shell
} = require('electron');


var textarea = document.querySelector('textarea');
textarea.addEventListener('input', translate);
function translate() {
  var input = document.querySelector('textarea').value
  input = encodeURIComponent(input)
  ipcRenderer.send('translate', input);
}

var debugdata = ""
ipcRenderer.on('translated', (event, data) => {
  debugdata = data
  var rightcontent = document.querySelector('#rightcontent');
  console.log(data.split('\"'))
  rightcontent.value = data.split(/<\/span>/g)[3].substr(31)
})