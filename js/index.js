var path = "config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

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
      url: url + "getadd",
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
          status = res[0].restf
          if (status == "审批通过") {
            document.getElementById("statusText").innerHTML = "审批已通过！"
            $("#status").attr("class", "alert alert-success")
          } else if (status == "驳回") {
            document.getElementById("statusText").innerHTML = "报销已驳回！"
            $("#status").attr("class", "alert alert-danger")
          } else if (status == "未审核") {
            document.getElementById("statusText").innerHTML = "报销待审核中！"
            $("#status").attr("class", "alert alert-warning")
          }
          for (let i = 0; i < res.length; i++) {
            for (const k in res[i]) {
              add.push(res[i][k])
            }
            for (let j = 0; j < add.length - 1; j++) {
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


//获取inputs数据，存储图片
function submit() {
  var texts = {
    name: $("#text1").val(),
    oodnumber: $("#text2").val(),
    money: $("#text3").val(),
    restf: "未审核",
    picpath: ""
  }
  let file = document.getElementById("choose").files[0];
  let formData = new FormData();
  formData.append("avatar", file);
  console.log(formData)

  if (texts.name == '') {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "报销人姓名不能为空"
  } else if (texts.oodnumber == '' || !moneyform(texts.oodnumber)) {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "报销单号输入有误"
  } else if (texts.money == '' || !moneyform(texts.money)) {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "报销金额输入有误"
  } else if (file == null) {
    $("#status2").attr("class", "alert alert-danger")
    document.getElementById("statusText2").innerHTML = "请选择报销凭证图片"
  } else {

    $.ajax({
      type: 'POST',
      url: url + 'profile',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        console.log(data.filePath)
        texts.picpath = data.filePath;
        $(".newImg").attr("src", data.filePath);
      },
      error: function (err) {
        console.log(err.message);
      }
    })
    $.ajax({
      type: "post",
      url: url + "getval",
      data: JSON.stringify(texts),
      dataType: "json",
      success: (e) => {
        if (e == "0") {
          $("#status2").attr("class", "alert alert-success")
          document.getElementById("statusText2").innerHTML = "上传成功"
        } else if (e == "1") {
          $("#status2").attr("class", "alert alert-warning")
          document.getElementById("statusText2").innerHTML = "报销单号已存在"
        }
      }
    })
  }
}

//监听点击
$("#btns").click(() => {
  submit()
})

//监听回车
function enter() {
  if (event.keyCode == 13) {
    submit()
  }
}