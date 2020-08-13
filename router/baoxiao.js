let express = require("express");
let router = express.Router();
let MongoClient = require("mongodb").MongoClient;
let dburl = "mongodb://localhost:27017";
let dbName = "baoxiao"
let multer = require('multer');
let path = require('path');

router.use('/uploads', express.static('uploads'));

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
let upload = multer({ storage: storage })

router.get("/",function (req,res) {
  res.sendFile(__dirname+'/html/index.html')
});

//查询报销状态
router.post("/getadd", (req, res) => {
  let d
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
        let arr = []
        let temp = false
        let ass
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
router.post("/getval", (req, res) => {
  let jsondbs = ""
  req.on("data", (postvalue) => {
    jsondbs = JSON.parse(postvalue)
  })
  MongoClient.connect(dburl, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.log(err)
      return
    }
    let db = client.db(dbName)
    let d = jsondbs.oodnumber
    let temp = false
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

//存储报销凭证
router.post('/profile', upload.single('avatar'), function (req, res, next) {
  res.send({
    err: null,
    filePath: 'uploads/' + path.basename(req.file.path)
  });
});

router.delete('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.redirect('/login');
})

module.exports = router;