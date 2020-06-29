$(function(){
    var tobd=document.querySelector("tbody")
    var arr=[]
    $.ajax({
        type:"post",
        url:"http://localhost:8081/getdata",
        dataType:"json",         
        success:(b)=>{
            var odiv=document.createElement("div")
            var oimg=document.createElement("img")
            var sssarr=[]
            for (let i = 0; i < b.length; i++) {
                delete b[i]._id
                var oderdiv=document.querySelector(".sss")
                sssarr.push(b[i].picpath)
                delete b[i].picpath

                odiv.appendChild(oimg)
                oderdiv.appendChild(odiv)        
                var ipath=document.createElement("td")
                ipath.className="ipas"
                
                var imgpath = b[i].picpath
                console.log(imgpath)
                
                ipath.innerHTML='<strong>查看凭证</strong>'
                
                var tr=document.createElement("tr")
                tobd.appendChild(tr) 
                for (var k in b[i]) {
                    var td=document.createElement("td")
                    td.className="as"
                    tr.appendChild(td)
                    td.innerHTML=b[i][k] 
                }

                
                tr.appendChild(ipath)
                restf = b[i].restf
                var td=document.createElement("td")
                td.innerHTML="<select>" + "<option>"+restf+"</option>"+"<option>审批通过</option><option>驳回</option>"
                tr.appendChild(td)
            }

            var a=document.querySelectorAll("strong")
            console.log(a)
            for (let i = 0; i < a.length; i++) {
                a[i].onclick=function(){
                    var sss=document.querySelector(".sss")
                    sss.style.display="block"
                    oimg.src=sssarr[i]
                }
            }

            $(".btn").click(function(){
                var ass=[]
                var app=[]
                var sel=document.querySelectorAll("select")
                for (let i = 0; i < sel.length; i++) {
                    var index = sel[i].selectedIndex;
                    app.push(sel[i].options[index].value)  
                }
                
                var as=document.querySelectorAll("tr")
                console.log(b)
                for (let i = 0; i < b.length; i++) {
                    delete b[i]._id
                    ass.push(b[i].oodnumber)
                }
                console.log(ass)   
           
                var datas={
                    ass1:ass,
                    app1:app,
                }
                $.ajax({
                    type:"post",
                    url:"http://localhost:8081/updata",
                    data:JSON.stringify(datas),
                    dataType:"json",         
                    success:(e)=>{
                        console.log(e)
                        if(e=="0"){
                            alert("写入成功")
                            location.reload()

                        }else{
                            alert("写入失败")
                        }
                    }  
                })
            })
        }
    })
})