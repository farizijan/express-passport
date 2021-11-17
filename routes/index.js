var express = require('express');
var passport = require('passport');
var router = express.Router();

var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var users = {
    fariz : {
        name : "Fariz Izzan",
        uname : "fariz",
        pass : "fariz",
        role : "Backend Developer",
        token : "1234567890"
    }
};
passport.use(new LocalStrategy(
    function(uname, pass, done) {
        var valid = users[uname] && users[uname].pass == pass;
        if (!valid) { return done(null, false); }
        var token = Math.floor(Math.random() * 9000000000) + 1000000000;
        users[uname].token = token;
        var user = users[uname];
        return done(null, user);
    }
));

passport.use(new BearerStrategy(
    function(token, done) {
        var valid = false;
        var user = null;
        Object.entries(users).forEach(entry => {
            const [uname, detail] = entry;
            if(detail.token == token){
                valid = true;
                user = detail;
                return;
            }
        });
        if (!valid) { return done(null, false); }
        return done(null, user, { scope: 'all' });
    }
));

const requireLocal = function(req, res, next) {
    return passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {};
            err.status = 401;
            err.code = 'Unauthorized';

            return res.json(err);
        }
        req.user = user;
        return next(); 
    }) (req, res, next);
}

const requireBearer = function(req, res, next) {
    return passport.authenticate('bearer', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {};
            err.status = 401;
            err.code = 'Unauthorized';

            return res.json(err);
        }
        req.user = user;
        return next(); 
    }) (req, res, next);
}


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', 
    requireLocal,
    function(req, res) {
        res.json(req.user);
    }
);

router.get('/info', 
    requireBearer,
    function(req, res) {
        res.json(req.user);
    }
);
module.exports = router;
