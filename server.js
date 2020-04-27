require('dotenv').config();

var express       = require('express');
var mongoose      = require('mongoose');
var passport      = require('passport');
var http          = require('http');
var path          = require('path');
var engine        = require('ejs-locals');
var bodyParser    = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors')
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || 'mongod://localhost/app.js');

var app           = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: 'KingYeLLow',
    resave: false,
    saveUninitialized: false,    
    cookie: { maxAge:60000 },
    store: new (require('express-sessions'))({
      storage: 'mongodb',
    })
}));

app.use(passport.initialize());
app.use(passport.session());
const User = require('./Models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 // Enable routing and use port 1337.
require('./router')(app);
app.set('port', port);

 // Set up ejs templating.
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Set view folder.
app.set('views', path.join(__dirname, 'Views'));

// That line is to specify a directory where you could 
// link to static files (images, CSS, etc.). 
// So if you put a style.css file in that directory and you 
// could link directly to it in your view <link href=”style.css” rel=”stylesheet”>
app.use(express.static(path.join(__dirname, 'static')));
 
http.createServer(app).listen(port), function(){
  console.log('Express server listening on port ' + app.get('port'));
};

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
