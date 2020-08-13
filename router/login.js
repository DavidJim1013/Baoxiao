let express = require("express");
let router = express.Router();
let { User } = require('../public/js/models')
let jwt = require('jsonwebtoken');
let SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'

router.get("/",function (req,res) {
  res.sendFile(__dirname+'/html/login.html')
});

router.post('/auth', async (req, res) => {
  let user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: "1"
    })
  }

  let isPasswordValid = require('bcryptjs').compareSync(
    req.body.password,
    user.password
  )

  if (!isPasswordValid) {
    return res.status(422).send({
      message: "2"
    })
  }
  let realname = user.realname
  let token = jwt.sign({
    id: String(user._id)
  }, SECRET, { expiresIn: 60 * 60 * 24 * 7 })

  res.cookie('token',token,{
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
    httpOnly: true
  })
  return res.send({
    realname : realname
  })
})

module.exports = router;