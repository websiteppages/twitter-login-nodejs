// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
//var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');


var sess              = require('express-session');
var BetterMemoryStore = require('session-memory-store')(sess);


//var configDB = require('./config/database.js');

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration
var TwitterStrategy  = require('passport-twitter').Strategy;
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
  });

  passport.use(new TwitterStrategy({

	consumerKey     : 'Is6t4PzZL0xYCt0a9mVfvkQob',
	consumerSecret  : 'BFnOaq1zTZksIg3aTohg1R0lzI7pt2VCAPbPcyEQKchhlxpkyK',
	callbackURL     : 'http://192.168.43.201:8080/auth/twitter/callback'

},
function(token, tokenSecret, profile, done) {
	console.log('mmmmmmmmmmmmmmmmmmmmm',profile);
	return done(null, profile);


}));

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret

	// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: {
	// 	secure: 'auto',
	//   } }))



	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

app.get('/auth/twitter', passport.authenticate('twitter'));
	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}) );
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
