function enc_password(input, key) {var output = CryptoJS.AES.encrypt(input, key); return output;}
function dec_password(input, key) {var output = CryptoJS.AES.decrypt(input, key);output = output.toString(CryptoJS.enc.Utf8);return output;}

function save_options() {
  chrome.storage.sync.set({
    u: document.getElementById('username').value,
    p: enc_password(document.getElementById('psw').value, document.getElementById('username').value)
  }, function() {

    document.getElementById('status').textContent = 'Options saved.';

    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    u: 'u',
    p: 'p'
  }, function(items) {
    document.getElementById('username').value = items.u;
    document.getElementById('psw').value      = dec_password(items.p, items.u);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
