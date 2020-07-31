$(() => {
  var path = "config.json";
  var request = new XMLHttpRequest();
  request.open("GET", path, false);
  request.send();
  data = request.responseText;
  jsondata = JSON.parse(data);
  url = jsondata["url"]

  let token = localStorage.getItem("token");
  let data = {
    "token": token
  }
  $.ajax({
    url: url + "index",
    type: "post",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(data),
    success(res) {
      if (res.status != 200) {
        alert("当前是会员页面，请先登录后访问，谢谢");
        location.href = "/login.html"
      }
      else {
        document.getElementById("logStatus").innerHTML = "欢迎，" + res.realname + "!"
        document.getElementById("logStatus").className = "btn btn-success dropdown-toggle"
        document.getElementById("dropitem1").innerHTML = "登出"
        document.getElementById("dropitem1").href = "javascript:logout()"
      } 
    }
  })
})