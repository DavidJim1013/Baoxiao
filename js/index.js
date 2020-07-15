var path = "config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

function isNum() {
  let a = $("#addnums").val();
  let b = isNaN(a)
  if (b) {
    return false
  } else return true
}


function searchEnter() {
  if (event.keyCode == 13) {
    search()
  }
}

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
          document.getElementById("statusText").innerHTML="单号不存在！"
          alert("单号不存在")
        } else {
          var add = []
          var inputTexts = $(".input-texts")
          status = res[0].restf
          if (status == "审批通过"){
            document.getElementById("statusText").innerHTML="审批已通过！"
            $("#status").attr("class", "alert alert-success")
          } else if (status == "驳回"){
            document.getElementById("statusText").innerHTML="报销已驳回！"
            $("#status").attr("class", "alert alert-danger")
          } else if (status == "未审核"){
            document.getElementById("statusText").innerHTML="报销待审核中！"
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
    alert("单号输入有误")
  }
}

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
    alert("报销人姓名不能为空")
  } else if (texts.oodnumber == '') {
    alert("报销单号不能为空")
  } else if (texts.money == '') {
    alert("报销金额不能为空")
  } else if (file == null) {
    alert("请选择报销凭证图片")
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
          alert("上传成功")
          location.replace(location)
        } else if (e == "1") {
          alert("报销单号已存在")
        } else if (e == "2") {
          alert("请输入报销单号")
        }
      }
    })
  }
}


$("#btns").click(() => {
  submit()
})

function enter() {
  if (event.keyCode == 13) {
    submit()
  }
}