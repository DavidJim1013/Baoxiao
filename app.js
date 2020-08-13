let express = require("express");
let app = express();

let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')

let detectCookies = require('./Middleware/detectCookies')
let CheckAuthority = require('./Middleware/CheckAuthority')
let login = require("./router/login")
let baoxiao = require("./router/baoxiao")
let audit = require("./router/audit")

app.use('/public', express.static('public'));
app.use(bodyParser.json()) 
app.use(cookieParser())

app.use("/login",login)
app.use(detectCookies);
app.use('/baoxiao',baoxiao)
app.use(CheckAuthority)
app.use("/audit",audit)

app.listen("8081", () => {
  console.log('启动成功')
  console.log('启动端口8081')
})