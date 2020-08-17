let express = require("express");
let router = express.Router();
let MongoClient = require("mongodb").MongoClient;
let dburl = "mongodb://localhost:27017";
let dbName = "baoxiao"

router.use('/uploads', express.static('uploads'));

router.get("/",function (req,res) {
  res.sendFile(__dirname+'/html/table.html')
});

//显示页面
router.post("/getdata", async (req, res) => {
  let jsondbs = ""
  req.on("data", (postvalue) => {
    jsondbs = JSON.parse(postvalue)
  })
  MongoClient.connect(dburl, { useUnifiedTopology: true }, async (err, client) => {
    if (err) {
      console.log(err)
      return
    }
    let db = client.db(dbName)
    let d = parseInt(jsondbs.currentpage)
    let f = parseInt(jsondbs.itemsPage)
    let h = jsondbs.inputs
    let g = parseInt(jsondbs.conunts)

    function gets() {
      db.collection("baoxiao").find({ 'status': "驳回" }).limit(f).skip((d - 1) * f).toArray(async (err, result) => {
        if (err) {
          console.log(err)
          return
        }
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
router.post("/updata", (req, res) => {
  let s = ""
  let jsondbs = ""
  req.on("data", (postvalue) => {
    s = postvalue
  })
  req.on("end", () => {   
    MongoClient.connect(dburl, { useUnifiedTopology: true }, async (err, client) => {
      jsondbs = JSON.parse(s);
      let ass = []
      let app = []
      ass = jsondbs.ass1
      app = jsondbs.app1
      let db = client.db(dbName)
      for (let i = 0; i < ass.length; i++) {
        if (app[i] == "——") {

        } else {
          let dbtab = { 'oodnumber': ass[i] }
          let updateStr = { $set: { "status": app[i] } };
          await db.collection("baoxiao").updateOne(dbtab, updateStr)
          console.log("文档更新成功");
        }
      }
      client.close()
    })
  })
  res.send("0")
})

router.post("/updateOne", (req, res) => {
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
      let dbtab = { 'oodnumber': oodnumber }
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

router.delete('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.redirect('/login');
})



module.exports = router;