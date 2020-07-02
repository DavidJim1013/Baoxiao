var path = "config.json";
var request = new XMLHttpRequest();
request.open("GET", path, false);
request.send();
data = request.responseText;
jsondata = JSON.parse(data);
url = jsondata["url"]

$("#addbtn").click(() => {
    $.ajax({
        type: "post",
        url: url+"getadd",
        data: $("#addnums").val(),
        dataType: "json",
        success: (res) => {
            if (res == "0") {
                alert("单号不存在")
            } else {
                var add = []
                var inputTexts = $(".input-texts")
                for (let i = 0; i < res.length; i++) {
                    for (const k in res[i]) {
                        add.push(res[i][k])
                    }
                    for (let j = 0; j < add.length-1; j++) {
                        if(j==2){
                            inputTexts[j].innerHTML = '¥'+add[j]
                        }else inputTexts[j].innerHTML = add[j]
                    }
                }
            }
        }
    })
})

$("#btns").click(() => {
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
    } else if (texts.oodnumber == ''){
        alert("报销单号不能为空")
    } else if (texts.money == ''){
        alert("报销金额不能为空")
    } else if (file == null){
        alert("请选择报销凭证图片")
    }else{
    
    $.ajax({
        type: 'POST',
        url: url+'profile',  
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
        url: url+"getval",
        data: JSON.stringify(texts),
        dataType: "json",
        success: (e) => {
            if (e == "0") {
                alert("上传成功")
            } else if (e == "1") {
                alert("报销单号已存在")
            } else if (e == "2") {
                alert("请输入报销单号")
            }
        }
    })
    }
})