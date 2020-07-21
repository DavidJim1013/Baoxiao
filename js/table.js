var path = "config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
urldata = request.responseText;
jsondata = JSON.parse(urldata);
url = jsondata["url"]

var page = 1
var size = 10
var totalNum
var totalPage
var input
var datas = '0'
var data = {
  currentpage: page,
  itemsPage: size,
  conunts: datas,
  inputs: input
}

//获取总项数
$.ajax({
  type: "post",
  url: url + "getdata",
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
  var tobd = document.querySelector("tbody")
  var data = {
    currentpage: page,
    itemsPage: size,
    conunts: datas,
    inputs: input
  }
  $.ajax({
    type: "post",
    url: url + "getdata",
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
        alert("没有记录")
      } else {

        let b = result.result
        var odiv = document.createElement("div")
        odiv.className = 'ping'
        var oimg = document.createElement("img")
        oimg.className = "img-fluid"
        var sssarr = []

        for (let i = 0; i < b.length; i++) {
          delete b[i]._id
          var oderdiv = document.querySelector(".sss")
          sssarr.push(b[i].picpath)
          delete b[i].picpath
          odiv.appendChild(oimg)
          oderdiv.appendChild(odiv)
          var ipath = document.createElement("td")
          ipath.className = "ipas"

          ipath.innerHTML = '<strong><i class="zi zi_fileImage" zico="图片文件黑"></i></strong>'

          var tr = document.createElement("tr")
          tobd.appendChild(tr)
          for (var k in b[i]) {
            var td = document.createElement("td")
            td.className = "as"
            tr.appendChild(td)
            td.innerHTML = b[i][k]
          }

          tr.appendChild(ipath)
          restf = b[i].restf
          var td = document.createElement("td")
          td.innerHTML = "<select>" + "<option>" + restf + "</option>" + "<option>通过</option><option>驳回</option>"
          tr.appendChild(td)
        }

        

        var a = document.querySelectorAll("strong")
        for (let i = 0; i < a.length; i++) {
          a[i].onclick = function () {
            var image = new Image();
            image.src = sssarr[i]
            var viewer = new Viewer(image, {
              hidden: function () {
                viewer.destroy();
              },
            });
            // image.click();
            viewer.show();
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
    var newpage = $("#pageNum").val()
    newpage = parseInt(newpage)
    if (newpage == "" || newpage == null || isNaN(newpage)) {
      alert("页码输入有误")
    }
    else if (newpage < 1 || newpage > totalPage) {
      alert("页码输入有误")
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
  var pageNumBegin = (page - 1) * size + 1;
  var pageNumEnd = page * size
  if (pageNumEnd > totalNum) {
    pageNumEnd = totalNum;
  }

  if ((totalPage == 1) || (totalPage == 0)) {
    //如果只有一页，上一步，下一步都为灰色
    $("#previousPage").css("color", "#AAA");//给上一步加灰色
    $("#nextPage").css("color", "#AAA");//给下一步加灰色
  } else if (page - 1 < 1) {
    //如果是首页,则给上一步加灰色，下一步变蓝
    $("#previousPage").css("color", "#AAA");//给上一步加灰色
    $("#nextPage").css("color", "#00F");//给下一步加蓝色
  } else if (page == totalPage) {
    //如果是尾页,则给上一步加蓝色，下一步灰色
    $("#previousPage").css("color", "#00F");//给上一步标签加蓝色
    $("#nextPage").css("color", "#AAA");//给下一步标签加灰色
  } else {
    //上一步为蓝色，下一步为绿色
    $("#previousPage").css("color", "#00F");//给上一步加蓝色
    $("#nextPage").css("color", "#00F");//给下一步加蓝色
  }

  document.getElementById("DataTables_Table_0_info").innerHTML =
    "第 " + page.toString() + " 页，" + "共 " + totalPage.toString() + " 页 "
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

//监听点击
$("#btnnone").click(function () {
  var sss = document.querySelector(".sss")
  sss.style.display = "none"
})

//下一页
$("#nextPage").click(function () {
  if (page + 1 > totalPage) {
    alert("已经是最后一页了")
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
    alert("已经是第一页了")
  } else {
    $(".tob").empty()
    page--
    dataupdate()
    getData(size, page, datas)
  }
})

//监听确认修改按钮点击
$("#confirm").click(function () {
  var ass = []
  var app = []
  var b
  var sel = document.querySelectorAll("select")
  for (let i = 0; i < sel.length - 1; i++) {
    var index = sel[i].selectedIndex;
    app.push(sel[i].options[index].value)
  }

  $.ajax({
    type: "post",
    url: url + "getdata",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    success: (result) => {
      b = result.result
    }
  })

  for (let i = 0; i < b.length; i++) {
    ass.push(b[i].oodnumber)
  }

  console.log(ass)
  console.log(app)

  var selections = {
    ass1: ass,
    app1: app
  }

  $.ajax({
    type: "post",
    url: url + "updata",
    data: JSON.stringify(selections),
    async: false,
    dataType: "json",
    success: (e) => {
      if (e == "0") {
        // alert("写入成功")
        $(".tob").empty()
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
  $("#searchAll").attr("class", "nav-item")
  $("#searchPass").attr("class", "nav-item")
  $("#searchReturn").attr("class", "nav-item")
  $(".tob").empty()
  datas = "2"
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