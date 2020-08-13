let path = "/public/config.json"
let request = new XMLHttpRequest()
request.open("GET", path, false)
request.send()
urldata = request.responseText
jsondata = JSON.parse(urldata)
url = jsondata["url"]

document.getElementById("web1").href = url + "baoxiao"
document.getElementById("web2").href = url + "audit"
document.getElementById("dropitem1").href = url + "login"

name = localStorage.getItem('name')
document.getElementById("logStatus").innerHTML = "欢迎，" + name + "!"
document.getElementById("logStatus").className = "btn btn-success dropdown-toggle"
document.getElementById("dropitem1").innerHTML = "登出"
document.getElementById("dropitem1").href = "javascript:logout()"

let page = 1
let size = 10
let state = 1
let totalNum
let totalPage
let input
let datas = '0'
let data = {
  currentpage: page,
  itemsPage: size,
  conunts: datas,
  inputs: input
}

//获取总项数
$.ajax({
  type: "post",
  url: url + "audit/getdata",
  async: false,
  data: JSON.stringify(data),
  dataType: "json",
  success: (result) => {
    totalNum = result.count
  }
})

totalpageCount()
getData(size, page, datas)

//先清空table，然后根据每页输出个数，页数来输出新的数据。
function getData(size, page, datas) {
  let tobd = document.querySelector("tbody")
  let data = {
    currentpage: page,
    itemsPage: size,
    conunts: datas,
    inputs: input
  }
  $.ajax({
    type: "post",
    url: url + "audit/getdata",
    data: JSON.stringify(data),
    async: false,
    dataType: "json",
    success: (result) => {
      totalNum = result.count
      totalpageCount()
      console.log(result)

      //提示没有记录
      if (totalNum == 0) {
        bottomInf()
        document.getElementById("tips").innerHTML = "此页面无记录！"
        $("#exampleModalCenter").modal('show')
      } else {

        let b = result.result
        let imgPaths = []

        for (let i = 0; i < b.length; i++) {
          delete b[i]._id
          let status = b[i].status
          let oodnumber = b[i].oodnumber

          imgPaths.push(b[i].pic)
          delete b[i].pic
          let ipath = document.createElement("td")
          ipath.innerHTML = '<strong><i class="zi zi_fileImage" style= "cursor:pointer" zico="图片文件黑"></strong>'

          let tr = document.createElement("tr")
          if (status == "通过") {
            tr.className = "table-success"
          } else if (status == "驳回") {
            tr.className = "table-danger"
          } else if (status == "未审核" || status == "审核中") {
            tr.className = "table-warning"
          }
          delete b[i].status
          tobd.appendChild(tr)
          for (let k in b[i]) {
            let td = document.createElement("td")
            td.className = "as"
            tr.appendChild(td)
            td.innerHTML = b[i][k]
          }

          tr.appendChild(ipath)
          let td = document.createElement("td")
          td.className = "options"
          if (status == "通过") {
            td.innerHTML = "<select><option>——</option><option>审核中</option><option>驳回</option>"
          } else if (status == "驳回") {
            td.innerHTML = "<select><option>——</option><option>审核中</option><option>通过</option>"
          } else if (status == "未审核") {
            td.innerHTML = "<select><option>——</option><option>审核中</option><option>通过</option><option>驳回</option>"
          } else if (status == "审核中") {
            td.innerHTML = "<select><option>——</option><option>通过</option><option>驳回</option>"
          }
          tr.appendChild(td)

          let btn = document.createElement("td")
          btn.className = "buttons"
          btn.setAttribute("data-ood", oodnumber)

          if (status == "通过") {
            btn.innerHTML = '<i class="zi zi_times" zico="错号粗黑" title="驳回" onclick="updateOne(this,2)"></i> <i class="zi zi_stopcircle" zico="暂停圆标" title="暂定" onclick="updateOne(this,3)"></i>'
          } else if (status == "驳回") {
            btn.innerHTML = '<i class="zi zi_check" zico="勾" title="通过" onclick="updateOne(this,1)"></i> <i class="zi zi_stopcircle" zico="暂停圆标" title="暂定" onclick="updateOne(this,3)"></i>'
          } else if (status == "未审核") {
            btn.innerHTML = '<i class="zi zi_check" zico="勾" title="通过" onclick="updateOne(this,1)"></i> <i class="zi zi_times" zico="错号粗黑" title="驳回" onclick="updateOne(this,2)"></i> <i class="zi zi_stopcircle" zico="暂停圆标" title="暂定" onclick="updateOne(this,3)"></i>'
          } else if (status == "审核中") {
            btn.innerHTML = '<i class="zi zi_check" zico="勾" title="通过" onclick="updateOne(this,1)"></i> <i class="zi zi_times" zico="错号粗黑" title="驳回" onclick="updateOne(this,2)"></i>'
          }
          tr.appendChild(btn)
        }

        let a = document.querySelectorAll("strong")
        for (let i = 0; i < a.length; i++) {
          a[i].onclick = function () {
            disLength = imgPaths[i].length
            if (imgPaths[i].substring(disLength - 3, disLength) == "pdf") {
              window.open(url + "audit/" + imgPaths[i], "_blank")
            } else {
              let image = new Image();
              image.src = "audit/"+imgPaths[i]
              let viewer = new Viewer(image, {
                hidden: function () {
                  viewer.destroy();
                },
              });
              viewer.show();
            }
          }
        }
        bottomInf()
      }
    }
  })
}



//每页显示个数改变
function research(v) {
  size = v
  totalpageCount()
  page = 1
  dataupdate()
  $(".tob").empty()
  getData(size, page, datas)
}

//转跳指定页数
function Topage() {
  if (event.keyCode == 13) {
    let newpage = $("#pageNum").val()
    newpage = parseInt(newpage)
    if (newpage == "" || newpage == null || isNaN(newpage)) {
      document.getElementById("tips").innerHTML = "页码输入有误！"
      $("#exampleModalCenter").modal('show')
    }
    else if (newpage < 1 || newpage > totalPage) {
      document.getElementById("tips").innerHTML = "页码输入有误！"
      $("#exampleModalCenter").modal('show')
    }
    else if (newpage == page) {
    }
    else {
      page = newpage
      dataupdate()
      $(".tob").empty()
      getData(size, page, datas)
    }
  }
}

//底下数据
function bottomInf() {
  if ((totalPage == 1) || (totalPage == 0)) {
    //如果只有一页，上一步，下一步都为灰色
    $("#previousPage").css("color", "#AAA")
    $("#nextPage").css("color", "#AAA")
  } else if (page - 1 < 1) {
    //如果是首页,则给上一步加灰色，下一步变蓝
    $("#previousPage").css("color", "#AAA")
    $("#nextPage").css("color", "#00F")
  } else if (page == totalPage) {
    //如果是尾页,则给上一步加蓝色，下一步灰色
    $("#previousPage").css("color", "#00F")
    $("#nextPage").css("color", "#AAA")
  } else {
    //上一步为蓝色，下一步为绿色
    $("#previousPage").css("color", "#00F")
    $("#nextPage").css("color", "#00F")
  }

  document.getElementById("PageNum_info").innerHTML = "第 " + page.toString() + " 页，" + "共 " + totalPage.toString() + " 页 "
  $("#pageNum").attr("placeholder", page)
}

//计算总页数
function totalpageCount() {
  if (totalNum / size == 0) {
    totalPage = totalNum / size;
  } else {
    totalPage = Math.ceil(totalNum / size);
  }
}

//更新当前页面信息：当前页数，每页项数，数据
function dataupdate() {
  data = {
    currentpage: page,
    itemsPage: size,
    conunts: datas,
    inputs: input
  }
}

//下一页
$("#nextPage").click(function () {
  if (page + 1 > totalPage) {
    document.getElementById("tips").innerHTML = "已经是最后一页了！"
    $("#exampleModalCenter").modal('show')
  } else {
    $(".tob").empty()
    page++
    dataupdate()
    console.log(data)
    getData(size, page, datas)
  }
})

//上一页
$("#previousPage").click(function () {
  if (page == 1) {
    document.getElementById("tips").innerHTML = "已经是第一页了！"
    $("#exampleModalCenter").modal('show')
  } else {
    $(".tob").empty()
    page--
    dataupdate()
    getData(size, page, datas)
  }
})

$("#showbtn").click(function () {
  let btns = document.getElementsByClassName("buttons")
  let otps = document.getElementsByClassName("options")
  if (state == 1) {
    document.getElementById("popWindow").style.display = "block"
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.display = "none"
      otps[i].style.display = "block"
    }
    state = 2
  } else {
    document.getElementById("popWindow").style.display = "none"
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.display = "block"
      otps[i].style.display = "none"
      state = 1
    }
  }

})

//监听确认修改按钮点击
$("#confirm").click(function () {
  let oodNum = []
  let newStatus = []
  let b
  let sel = document.querySelectorAll("select")
  for (let i = 0; i < sel.length - 1; i++) {
    let index = sel[i].selectedIndex;
    newStatus.push(sel[i].options[index].value)
  }

  $.ajax({
    type: "post",
    url: url + "audit/getdata",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    success: (result) => {
      b = result.result
    }
  })

  for (let i = 0; i < b.length; i++) {
    oodNum.push(b[i].oodnumber)
  }

  console.log(oodNum)
  console.log(newStatus)

  let selections = {
    ass1: oodNum,
    app1: newStatus
  }

  $.ajax({
    type: "post",
    url: url + "audit/updata",
    data: JSON.stringify(selections),
    async: false,
    dataType: "json",
    success: (e) => {
      if (e == "0") {
        // alert("写入成功")
        document.getElementById("tips").innerHTML = "修改成功！"
        $("#exampleModalCenter").modal('show')
        $(".tob").empty()
        state = 1
        document.getElementById("popWindow").style.display = "none"
        getData(size, page, datas)
      } else {
        alert("写入失败")
      }
    }
  })
})


//显示所有驳回
function searchReturn() {
  $("#searchReturn").attr("class", "nav-item active")
  $("#searchAll").attr("class", "nav-item")
  $("#searchDoing").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchUndone").attr("class", "nav-item")
  $(".tob").empty()
  datas = "1"
  page = 1
  dataupdate()
  getData(size, page, datas)
}

//显示所有数据
function searchAll() {
  $("#searchAll").attr("class", "nav-item active")
  $("#searchDoing").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchUndone").attr("class", "nav-item")
  $(".tob").empty()
  datas = "0"
  page = 1
  dataupdate()
  getData(size, page, datas)
}

//显示所有审批通过
function searchPass() {
  $("#searchPass").attr("class", "nav-item active")
  $("#searchDoing").attr("class", "nav-item")
  $("#searchAll").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $("#searchUndone").attr("class", "nav-item")
  $(".tob").empty()
  datas = "3"
  page = 1
  dataupdate()
  getData(size, page, datas)
}

//显示所有未审批
function searchUndone() {
  $("#searchUndone").attr("class", "nav-item active")
  $("#searchDoing").attr("class", "nav-item")
  $("#searchAll").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $(".tob").empty()
  datas = "2"
  page = 1
  dataupdate()
  getData(size, page, datas)
}

function searchDoing() {
  $("#searchDoing").attr("class", "nav-item active")
  $("#searchUndone").attr("class", "nav-item")
  $("#searchAll").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $(".tob").empty()
  datas = "6"
  page = 1
  dataupdate()
  getData(size, page, datas)
}


function isRealNum(val) {
  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    return true;
  }
  else {
    return false;
  }
}

function Lookup() {
  $("#searchDoing").attr("class", "nav-item")
  $("#searchAll").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchUndone").attr("class", "nav-item")
  $(".tob").empty()
  page = 1
  input = $("#NameOrNum").val()
  if (isRealNum(input)) {
    datas = "4"
  } else datas = "5"
  dataupdate()
  getData(size, page, datas)
}

function isEnter() {
  if (event.keyCode == 13) {
    Lookup()
  }
}


function updateOne(obj, abc) {
  let type = abc
  let father = $(obj).parent()
  let oodNum = $(father).attr("data-ood")

  let data = {
    one: type,
    two: oodNum
  }

  $.ajax({
    type: "post",
    url: url + "audit/updateOne",
    data: JSON.stringify(data),
    async: false,
    dataType: "json",
    success: (e) => {
      if (e == "0") {
        $(".tob").empty()
        state = 1
        document.getElementById("popWindow").style.display = "none"
        getData(size, page, datas)
      } else {
        alert("写入失败")
      }
    }

  })
}

function logout() {
  $.ajax({
    type:"delete",
    url: url + "audit/logout",
  })
  localStorage.removeItem('name')
  alert("已登出")
  location.href = "/login"
}