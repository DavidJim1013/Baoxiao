var path = "config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

document.getElementById("web1").href = url
document.getElementById("web2").href = url + "table.html"
document.getElementById("web3").href = url + "login.html"

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
    "username" : $("#Input1").val(),
    "password" : $("#InputPassword1").val()
  }
  console.log(formData)
  $.ajax({
    type: 'POST',
    url: url + 'login',
    data: JSON.stringify(formData),
    dataType: "json",
    contentType: "application/json",
    success: (res)=>{
      alert("登陆成功")
      localStorage.setItem("token",res.token)
      location.href = "/"
    },
    error: (res)=>{
      console.log(res.responseJSON.message)
    }
  })
}