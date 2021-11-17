var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

passport.use(new LocalStrategy(
    function(uname, pass, done) {
        var valid = uname == 'fariz' && pass == 'fariz';
        var user = { name : "Fariz Izzan", role: "Backend Developer" };
        if (!valid) { return done(null, false); }
        return done(null, user);
    }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
// app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
