var path = "/public/config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

document.getElementById("web1").href = url + "baoxiao"
document.getElementById("web2").href = url + "shenhe"
document.getElementById("web3").href = url + "audit"

function acc() {
  document.getElementById("logintab1").className = "flex-sm-fill text-sm-center nav-link active"
  document.getElementById("logintab2").className = "flex-sm-fill text-sm-center nav-link"
  document.getElementById("ACC").style.display = "block"
  document.getElementById("QR").style.display = "none"
}

function scan() {
  document.getElementById("logintab2").className = "flex-sm-fill text-sm-center nav-link active"
  document.getElementById("logintab1").className = "flex-sm-fill text-sm-center nav-link"
  document.getElementById("QR").style.display = "block"
  document.getElementById("ACC").style.display = "none"
}

function enter() {
  if (event.keyCode == 13) {
    login()
  }
}

function login() {
  let formData = {
    "username": $("#Input1").val(),
    "password": $("#InputPassword1").val()
  }
  $.ajax({
    type: 'POST',
    url: url + 'login/auth',
    data: JSON.stringify(formData),
    dataType: "json",
    contentType: "application/json",
    success: (res) => {
      localStorage.setItem('name',res.realname)
      localStorage.setItem('authority',res.authority)
      alert('登陆成功')
      location.href = "/baoxiao"
    },
    error: (res) => {
      let message = res.responseJSON.message
      if (message == '1'){
        $('#account').popover('show')
      }
      if (message == '2'){
        $('#account').popover('hide')
        $('#passwor').popover('show')
      }
    }
  })
}