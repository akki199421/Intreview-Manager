require('rootpath')();
var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var session = require('express-session');
var expressJwt = require('express-jwt');
var config = require('config.json');
var logger = require('morgan');
var expressValidator = require('express-validator');

// const LiveReload = require('livereload');

//mongo config

//config 

mongoose.connect(config.dbUrl);
// mongoose.Promise = require('bluebird');
mongoose.connection.once('open', function(callback){
	console.log('dfdsfd');
})


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/user/authenticate', '/api/user/register'] }));

// const liveReloadServer = LiveReload.createServer({
//   port: 35729,
//   debug: true
// });

// liveReloadServer.watch(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

// use JWT auth to secure the api
// app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// // routes
app.use('/submission', require('./controller/submission.controller'));
app.use('/login', require('./controller/login.controller'));
app.use('/register', require('./controller/register.controller'));
app.use('/app', require('./controller/app.controller'));
// app.use('/register', require('./controllers/register.controller'));
// app.use('/app', require('./controllers/app.controller'));
// app.use('/api/users', require('./controllers/api/users.controller'));

// api config
app.use('/api/candidate',require('./controller/api/candidate.controller'));
app.use('/api/user',require('./controller/api/user.controller'));


app.get('/', function(req, res){
	res.redirect('/register');
});

// start server
var server = app.listen(3001, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});