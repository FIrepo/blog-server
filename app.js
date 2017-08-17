const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const index = require('./routes/index');
const users = require('./routes/users');
const log = require('./routes/log');
const blog = require('./routes/blog');

// 前台展示
let show =require('./routes/show')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'love',
    cookie: {maxAge: 1000 * 60 * 100}
}))

app.use('/api/show/', show)

// 随后的请求登录拦截
app.use(function (req, res, next) {
    if (!req.session.user) {
        if (req.url === '/api/users/login' || req.url === '/api/users/loginOut') {
            next();//如果请求的地址是登录则通过，进行下一个请求
        }
        else {
            res.json({
                statue: 5
            })
        }
    } else if (req.session.user) {
        next();
    }
})

app.use('/', index);
app.use('/api/users', users);
app.use('/api/log', log);
app.use('/api/blog', blog);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;