let express = require("express");
let app = express();
const multer = require('multer');
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const dburl = "mongodb://localhost:27017";
var fs = require("fs");
// const { Console } = require("console");
const dbName = "baoxiao"
app.use(express.static('./'));


app.get("/", (req, res) => {
    fs.readFile("./index.html", "utf-8", (err, data) => {
        res.send(data)
    })
})

app.get("/s", (req, res) => {
    fs.readFile("./table.html", "utf-8", (err, data) => {
        res.send(data)
    })
})

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({storage : storage})

app.post("/getadd", (req, res) => {
    var d
    req.on("data", (num) => {
        d = num
    })
    req.on("end", () => {
        MongoClient.connect(dburl, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err)
                return
            }
            let db = client.db(dbName)
            db.collection("baoxiao").find({}).toArray((err, reust) => {
                var arr = []
                var temp = false
                var ass
                for (let i = 0; i < reust.length; i++) {
                    if (reust[i].oodnumber == d) {
                        delete reust[i]._id
                        arr.push(reust[i])
                        temp = true
                        ass = JSON.stringify(arr)
                        client.close()
                    }
                }
                if (temp == true) {
                    res.end(ass)
                } else {
                    res.end("0")
                }
            
            })
        })
    })
})

//新增报销单
app.post("/getval",(req,res)=>{
    var jsondbs = ""
    req.on("data", (postvalue) => {
        jsondbs = JSON.parse(postvalue)
    })
    //监听响应
    MongoClient.connect(dburl, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err)
            return
        }
        let db = client.db(dbName)
        var d = jsondbs.oodnumber
        var temp = false
        db.collection("baoxiao").find({}).toArray((err, reust) => {
            for (let i = 0; i < reust.length; i++) {
                if (reust[i].oodnumber == d) {
                    temp = true
                }
            }
            if(temp && d!=""){
                console.log("已存在")
                res.end("1")
            } else{
                if (d == ""){
                    console.log("订单号为空")
                    res.end("2")
                } else{
                    db.collection("baoxiao").insertOne(jsondbs, (err, data) => {
                        if (err) {
                            console.log(err);
                            return
                        }
                        console.log("添加成功")
                        res.end("0")
                        client.close()
                    })
                }
            }
        })
    })
    
})

app.post("/getdata",(req,res)=>{
   
        MongoClient.connect(dburl, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err)
                return
            }
            let db = client.db(dbName)
            db.collection("baoxiao").find({}).toArray((err, reust) => {
                if (err) {
                    console.log(err)
                    return
                }
                console.log(reust)
                res.send(reust)
            })
        })
    
})

app.post("/updata",(req,res)=>{
    var s = ""
    var jsondbs = ""
    req.on("data", (postvalue) => {
        s += postvalue
        // console.log(s)
    })
    req.on("end", () => {
        // console.log(jsondbs)      
        MongoClient.connect(dburl, { useUnifiedTopology: true }, (err, client) => {
            jsondbs = JSON.parse(s);
            var  ass=[]
            var  add=[]
            ass=jsondbs.ass1
            add=jsondbs.app1
            let db = client.db(dbName)
            for(var i=0;i<ass.length;i++){
                console.log(ass.length)
                if (err) {
                    console.log(err)
                }
                var  dbtab={'oodnumber':ass[i]}
                var updateStr={$set: {"restf":add[i]}};
                console.log(updateStr)
                db.collection("baoxiao").updateOne(dbtab, updateStr, function(err, res) {
                    if (err) {
                        console.log(err)        
                    }
                    console.log("文档更新成功");
                })
            }
            //client.close()
        })
    })
    res.send("0")
})

app.post('/profile', upload.single('avatar'), function(req, res, next) {
    res.send({
      err: null,
      filePath: 'uploads/' + path.basename(req.file.path)
    });
});


app.listen("8081", () => {
    console.log('启动成功')
})