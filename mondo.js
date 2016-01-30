var balance     = "";
var spend_today = "";
var currency    = "";
var baseUrl;
var account;
var token;

function authenticate(u, p) {

  baseUrl = config.url;

  // authenticate
  $.post(baseUrl + "/oauth2/token",
    { grant_type: "password",
    client_id: config.client_id,
    client_secret: config.client_secret,
    username: u,
    password: p
  }).done(function(data) {

    token = data.access_token;

    document.getElementById('status').textContent = '';

    getAccounts();
  }).fail(function(data) {
    document.getElementById('status').textContent = 'Authentication failed.';


    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  });
}

function getAccounts() {

  var request = {};
  request.url = baseUrl + "/accounts";
  request.beforeSend = function (xhr) {xhr.setRequestHeader("Authorization", "Bearer " + token)};
  request.type = "GET";

  $.ajax(request).done(function(data)
  {
    account = data.accounts[0].id;

    document.getElementById('status').textContent = '';

    getBalance();

  }).fail(function(data) {
    document.getElementById('status').textContent = 'Failed to get account';
  });
}

function getBalance() {

  var request = {};

  request.url        = baseUrl + "/balance?account_id=" + account;
  request.beforeSend = function (xhr) {xhr.setRequestHeader("Authorization", "Bearer " + token)};
  request.type       = "GET";

  $.ajax(request).done(function(data)
  {
    balance     = data.balance;
    currency    = data.currency;
    spend_today = data.spend_today;

    document.getElementById('status').textContent = '';

    updateBalance();
    updateSpent();

  }).fail(function(data) {
    document.getElementById('status').textContent = 'Failed to get balance';
  });
}

function fetchBalance() {
  var b = (balance / 100);
  return "£" + b.toFixed(2);
}

function fetchSpent() {
  var s = (0 - spend_today / 100);
  return "£" + s.toFixed(2);
}

function updateBalance() {
  document.getElementById("balance").innerHTML = fetchBalance();
}

function updateSpent() {
  document.getElementById("today").innerHTML = fetchSpent();
}

function dec_password(input, key) {var output = CryptoJS.AES.decrypt(input, key);output = output.toString(CryptoJS.enc.Utf8);return output;}

function load_options_and_process() {
  chrome.storage.sync.get({
    u: 'u',
    p: 'p'
  }, function(items) {
    authenticate(items.u, dec_password(items.p, items.u));
  });
}

load_options_and_process();
