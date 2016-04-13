var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'Login | VLBC',
    email: '',
    info: ''
  });
});


router.post('/', function(req, res, next){

  var email = req.body.email;
  var pass = req.body.password;

  console.log(email);
  console.log(pass);


  res.render('index', {
    title: 'Home | VLBC',
    email: email,
    password: pass
  })
});

module.exports = router;
