let express = require("express");
let app = express();
const multer = require('multer');
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const { User } = require('./models')
const dburl = "mongodb://localhost:1013";
const dbName = "baoxiao"
const jwt = require('jsonwebtoken')
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'
var bodyParser = require('body-parser')
app.use(express.static('./'));
app.use(bodyParser.json())
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
    var h = jsondbs.inputs
    var g = parseInt(jsondbs.conunts)

    //console.log(h)
    function gets() {
      db.collection("baoxiao").find({ 'status': "驳回" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'status': "驳回" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets2() {
      db.collection("baoxiao").find({ 'status': "未审核" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'status': "未审核" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets3() {
      db.collection("baoxiao").find({ 'status': "通过" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'status': "通过" }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets4() {
      db.collection("baoxiao").find({ 'oodnumber': h }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'oodnumber': h }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets5() {
      db.collection("baoxiao").find({ 'name': h }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'name': h }).count()
        let datass = { count: count, result }
        client.close()
        res.send(datass)
      })
    }
    function gets6() {
      db.collection("baoxiao").find({ 'status': "审核中" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(result)
        let count = await db.collection("baoxiao").find({ 'status': "审核中" }).count()
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
    }
    else if (g == 4) {
      gets4()
      return
    }
    else if (g == 5) {
      gets5()
      return
    } else if (g == 6) {
      gets6()
    }
    else {
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
        if (app[i] == "——") {

        } else {
          var dbtab = { 'oodnumber': ass[i] }
          var updateStr = { $set: { "status": app[i] } };
          await db.collection("baoxiao").updateOne(dbtab, updateStr)
          console.log("文档更新成功");
        }
      }
      client.close()
    })
  })
  res.send("0")
})

app.post("/updateOne", (req, res) => {
  let s = ""
  let jsondbs = ""
  req.on("data", (data) => {
    s = data
  })
  req.on("end", () => {
    MongoClient.connect(dburl, { useUnifiedTopology: true }, async (err, client) => {
      jsondbs = JSON.parse(s)
      let type = jsondbs.one
      let oodnumber = jsondbs.two
      let db = client.db(dbName)
      var dbtab = { 'oodnumber': oodnumber }
      if (type == "1") {
        await db.collection("baoxiao").updateOne(dbtab, { $set: { "status": "通过" } })
        res.send("0")
      } else if (type == "2") {
        await db.collection("baoxiao").updateOne(dbtab, { $set: { "status": "驳回" } })
        res.send("0")
      } else if (type == "3") {
        await db.collection("baoxiao").updateOne(dbtab, { $set: { "status": "审核中" } })
        res.send("0")
      } else { res.send("1") }
      client.close()
    })
  })
})

app.post('/login', async (req, res) => {
  console.log(req.body)
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: "用户不存在"
    })
  }

  const isPasswordValid = require('bcryptjs').compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordValid) {
    return res.status(422).send({
      message: "密码无效"
    })
  }


  const token = jwt.sign({
    id: String(user._id)
  }, SECRET, {expiresIn:  60 * 60 * 2})

  // 生成token
  res.send({
    user,
    token
  })
})

app.post("/index", async (req, res) => {
  var token = req.body.token;
  if (token == undefined) {
    res.send({ status: 500, msg: "用户未登录" });
  } else {
    const { id } = jwt.verify(token, SECRET)
    console.log(id)
    const user = await User.findById(id)
    if (user) {
      res.send({ status: 200, msg: "用户已登录", realname: user.realname });
    } else {
      res.send({ status: 400, msg: "用户非法访问" })
    }
  }
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