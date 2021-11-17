var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.send('Login success!');
  }
);

router.get('/info', 
  passport.authenticate('bearer'),
  function(req, res) {
    res.send('Success! This is info page.');
  }
);
module.exports = router;
