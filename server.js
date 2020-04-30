require('dotenv').config();

var express       = require('express');
var mongodb       = require('mongodb');
var passport      = require('passport');
var path          = require('path');
var engine        = require('ejs-locals');
var bodyParser    = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
var app           = express();
var ObjectID      = mongodb.ObjectID

mongodb.MongoClient.connect(process.env.MONGODB_URI) || "mongodb://localhost:22017/", function (err, client){
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
}

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,    
    cookie: { maxAge:60000 },
    store: new (require('express-sessions'))({
      storage: 'mongodb',
    })
}));

app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 // Enable routing.
require('./router')(app);

 // Set up ejs templating.
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// That line is to specify a directory where you could 
// link to static files (images, CSS, etc.). 
// So if you put a style.css file in that directory and you 
// could link directly to it in your view <link href=”style.css” rel=”stylesheet”>

/*
if (process.eng.NODE_ENV === 'production'){
  app.use(express.static(path.join('src/build')))
}
else{
  app.use(express.static(path.join(__dirname, 'static')));
}
*/
app.use(express.static(path.join(__dirname, 'static')));

// generic exception handler
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

var cors = require('cors')

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
