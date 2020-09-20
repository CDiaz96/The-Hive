// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');//ineracting or interfacing with mongoDB
var passport = require('passport');//enalbes us to create users, handle logged in session
var flash    = require('connect-flash');//shows error messages (ie wring password/nouser found)

var morgan       = require('morgan');//logs http requests while terminal is open
var cookieParser = require('cookie-parser');//enables us to store info about specific user on a site
var bodyParser   = require('body-parser');
var session      = require('express-session');//helps set-up/ manage logged in user session

var configDB = require('./config/database.js');//require grabs the file and stores whatever is held in this file in database.js as an object. the separate file can be set to git ignore so it doesn't show when pushed

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);//function call with arguements
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))//all static files are in public folder

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret key
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
