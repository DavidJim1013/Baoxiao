let express = require("express");
let app = express();
const multer = require('multer');
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const dburl = "mongodb://localhost:27017";
var fs = require("fs");
const e = require("express");
const dbName = "baoxiao"
app.use(express.static('./'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })

//查询报销状态
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
          }
        }
        client.close()
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
app.post("/getval", (req, res) => {
  var jsondbs = ""
  req.on("data", (postvalue) => {
    jsondbs = JSON.parse(postvalue)
  })
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
      if (temp && d != "") {
        console.log("已存在")
        res.end("1")
      } else {
        if (d == "") {
          console.log("订单号为空")
          res.end("2")
        } else {
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

//显示页面
app.post("/getdata", async (req, res) => {
  var jsondbs = ""
  req.on("data", (postvalue) => {
    jsondbs = JSON.parse(postvalue)
    console.log(jsondbs)
  })
  MongoClient.connect(dburl, { useUnifiedTopology: true }, async (err, client) => {
    if (err) {
      console.log(err)
      return
    }
    let db = client.db(dbName)
    var d = parseInt(jsondbs.currentpage)
    var f = parseInt(jsondbs.itemsPage)
    var g = parseInt(jsondbs.conunts)
    function gets() {
      db.collection("baoxiao").find({ 'restf': "驳回" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'restf': "驳回" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets2() {
      db.collection("baoxiao").find({ 'restf': "未审核" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'restf': "未审核" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets3() {
      db.collection("baoxiao").find({ 'restf': "审批通过" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'restf': "审批通过" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function getstow() {
      db.collection("baoxiao").find({}).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        let count = await db.collection("baoxiao").find().count()

        let datas = { count: count, result }
        client.close()
        res.send(datas)
      })
    }
    //全部
    if (g == 0) {
      getstow()
      return
    }
    //驳回
    else if (g == 1) {
      gets()
      return
    }
    //未审批
    else if (g == 2) {
      gets2()
      return
    }
    //审批通过
    else if (g == 3) {
      gets3()
      return
    } else {
      res.send("0")
    }

  })

})

//更新报销状态
app.post("/updata", (req, res) => {
  var s = ""
  var jsondbs = ""
  req.on("data", (postvalue) => {
    s = postvalue
    // console.log(s)
  })
  req.on("end", () => {
    // console.log(jsondbs)      
    MongoClient.connect(dburl, { useUnifiedTopology: true }, async (err, client) => {
      jsondbs = JSON.parse(s);
      var ass = []
      var app = []
      ass = jsondbs.ass1
      app = jsondbs.app1
      let db = client.db(dbName)
      for (var i = 0; i < ass.length; i++) {
        var dbtab = { 'oodnumber': ass[i] }
        var updateStr = { $set: { "restf": app[i] } };
        await db.collection("baoxiao").updateOne(dbtab, updateStr)
        console.log("文档更新成功");
      }
      client.close()
    })
  })
  res.send("0")
})

//存储报销凭证
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  res.send({
    err: null,
    filePath: 'uploads/' + path.basename(req.file.path)
  });
});


app.listen("8081", () => {
  console.log('启动成功')
  console.log('启动端口8081')
})