let jwt = require('jsonwebtoken')
let SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'
let { User } = require('../public/js/models')

module.exports = (async(req,res,next)=>{
  let cookies = req.headers.cookie
  if (cookies == undefined) {
    return res.redirect('/login');
  } else {
    let token = cookies.substring(6)
    jwt.verify(token, SECRET, function (err, id) {
      if (err) {
        res.clearCookie('token')
        return res.redirect('/login');
      }
    })
    let { id } = jwt.verify(token, SECRET)
    let user = await User.findById(id)
    if (user.authority > 1) {
      next()
    } else {
      return res.redirect('/baoxiao');
    }
  }
})