var path = "/public/config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

let today = "20200728"
let stringBacknum
let backNum = 0

document.getElementById("web1").href = url + "baoxiao"
document.getElementById("web2").href = "javascript:toAudit()"
document.getElementById("dropitem1").href = url + "login"

name = localStorage.getItem('name')
document.getElementById("logStatus").innerHTML = "欢迎，" + name + "!"
document.getElementById("logStatus").className = "btn btn-success dropdown-toggle"
document.getElementById("dropitem1").innerHTML = "登出"
document.getElementById("dropitem1").href = "javascript:logout()"

//判断输入订单号是否为数字，为数字返回true
function Null() {
  let a = $("#addnums").val();
  if (a == '') {
    $("#status").attr("class", "alert alert-danger")
    document.getElementById("statusText").innerHTML = "请输入报销单号！"
  } else search()
}

function isNum() {
  let a = $("#addnums").val();
  let b = isNaN(a)
  if (b) {
    return false
  } else return true
}

function moneyform(a) {
  if (isNaN(a)) {
    return false
  } else return true
}


//判断键盘输入是否为回车
function searchEnter() {
  if (event.keyCode == 13) {
    Null()
  }
}

//遍历数据库，有则输出报销状态
function search() {
  var inputTexts = $(".input-texts")
  for (let j = 0; j < 4; j++) {
    inputTexts[j].innerHTML = ''
  }
  if (isNum()) {
    $.ajax({
      type: "post",
      url: url + "baoxiao/getadd",
      async: false,
      data: $("#addnums").val(),
      dataType: "json",
      success: (res) => {
        if (res == "0") {
          $("#status").attr("class", "alert alert-danger")
          document.getElementById("statusText").innerHTML = "单号不存在！"
        } else {
          var add = []
          var inputTexts = $(".input-texts")
          status = res[0].status
          if (status == "通过") {
            document.getElementById("statusText").innerHTML = "审批已通过！"
            $("#status").attr("class", "alert alert-success")
          } else if (status == "驳回") {
            document.getElementById("statusText").innerHTML = "报销已驳回！"
            $("#status").attr("class", "alert alert-danger")
          } else if (status == "未审核") {
            document.getElementById("statusText").innerHTML = "报销待审核中！"
            $("#status").attr("class", "alert alert-warning")
          } else if (status == "审核中") {
            document.getElementById("statusText").innerHTML = "报销待审核中！"
            $("#status").attr("class", "alert alert-warning")
          }
          for (let i = 0; i < res.length; i++) {
            for (const k in res[i]) {
              add.push(res[i][k])
            }
            for (let j = 0; j < 4; j++) {
              if (j == 2) {
                inputTexts[j].innerHTML = '¥' + add[j]
              } else inputTexts[j].innerHTML = add[j]
            }
          }
        }
      }
    })
  }
  else {
    $("#status").attr("class", "alert alert-danger")
    document.getElementById("statusText").innerHTML = "单号输入有误"
  }
}

$("input[type=file]").change(function () {
  var fieldVal = $(this).val();

  // Change the node's value by removing the fake path (Chrome)
  fieldVal = fieldVal.replace("C:\\fakepath\\", "");

  if (fieldVal != undefined || fieldVal != "") {
    $(this).next(".custom-file-label").attr('data-content', fieldVal);
    $(this).next(".custom-file-label").text(fieldVal);
  }
});

function isNewDay() {
  let a = getToday()
  if (a == today) {
    today = getToday()
  } else {
    today = getToday()
    backNum = 0
  }
}

function getToday() {
  var year = new Date().getFullYear();//获取完整的年份(4位,1970-????)
  var month = new Date().getMonth() + 1;//获取当前月份(0-11,0代表1月)
  var day = new Date().getDate();//获取当前日(1-31)
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let dateString = year + month + day;
  return dateString
}

function generateNum() {
  isNewDay()
  backNum += 1
  if (backNum < 10) {
    stringBacknum = "000" + backNum
  } else if (backNum < 100) {
    stringBacknum = "00" + backNum
  } else if (backNum < 1000) {
    stringBacknum = "0" + backNum
  } else if (backNum = 1000) {
    stringBacknum = "1000"
  }
  return (today + stringBacknum)
}


//获取inputs数据，存储图片
function submit() {
  var texts = {
    name: $("#text1").val(),
    oodnumber: "",
    money: parseFloat($("#text3").val()),
    status: "未审核",
    pic: "",
    stage: "1"
  }
  let file = document.getElementById("choose").files[0];
  let formData = new FormData();
  formData.append("avatar", file);

  if (texts.name == '') {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "报销人姓名不能为空"
  } else if (texts.money == '' || !moneyform(texts.money) || !xiaoshu(texts.money)) {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "报销金额输入有误"
  } else if (file == null) {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "请选择报销凭证图片"
  } else {

    texts.oodnumber = generateNum()

    $.ajax({
      type: 'POST',
      url: url + 'baoxiao/profile',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        texts.pic = data.filePath;
        $(".newImg").attr("src", data.filePath);
      },
      error: function (err) {
        console.log(err.message);
      }
    })
    $.ajax({
      type: "post",
      url: url + "baoxiao/getval",
      data: JSON.stringify(texts),
      dataType: "json",
      success: (e) => {
        if (e == "0") {
          $("#status2").attr("class", "alert alert-success")
          document.getElementById("statusText2").innerHTML = "上传成功，请保存你的报销单号：" + "<strong>" + today + stringBacknum + "</strong>"
          $("#text1").val('')
          $("#text3").val('')
        } else if (e == "1") {
          submit()
        }
      }
    })
  }
}

//监听点击
$("#btns").click(() => {
  submit()
})

function toAudit(){
  let a = parseInt(localStorage.getItem('authority'))
  if (a == 0){
    alert("您没有权限")
  } else if (a > 0){
    location.href = "/audit"
  }
}

function logout() {
  $.ajax({
    type:"delete",
    url: url + "baoxiao/logout",
  })
  localStorage.removeItem('name')
  localStorage.removeItem('authority')
  alert("已登出")
  location.href = "/login"
}

//判断小数点
function xiaoshu(money){
  let a = money.toString()
  if (a.indexOf('.')==-1){
    return true
  }
  let dot = a.split(".")[1].length
  if (dot > 2 && dot != 1){
    return false
  } else return true
  
}

//监听回车
function enter() {
  if (event.keyCode == 13) {
    submit()
  }
}