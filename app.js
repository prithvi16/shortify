var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/// my sql setup
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'pvsukale',
    database: 'shortify'
});



app.use('/', routes);
app.use('/users', users);
app.post('/new', function(req, res) {

    var adress = req.body.adress;
    var uid = shortid.generate();
    specialQuery = "INSERT INTO urls values ( '" + uid + "','" + adress + "');"
    console.log(specialQuery);
    pool.query(specialQuery, function(err) {


    });




    res.render('success', { id: uid });


});

app.get('/:Id', function(req, res, next) {
    uid = req.params.Id;
    console.log(uid);
    myquery = "select address from urls where id='" + uid + "';";
    pool.query(myquery, function(err, rows, fields) {
        if (err) {
            next();

        } else {
            console.log(rows[0].address);
            res.redirect('http://' + rows[0].address);
        }


    });

});




/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(4000, function() {

    console.log("listening on 4000");

});




/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;