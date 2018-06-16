var             express         = require('express'),
                app             = express(),
                mongoose        = require('mongoose'),
                passport        = require('passport'),
                bodyParser      = require ('body-parser'),
                LocalStrategy   = require('passport-local'),
                passportLocalStrategy = require("passport-local-mongoose"),
                User            = require('./models/user');
                
mongoose.connect('mongodb://localhost/auth_demo_app');

//require express-session and immediately invoke it
app.use(require('express-session')({
    secret: "Crystal is something",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =========
// ROUTES
// =========

app.get('/', function(req, res){
    res.render('home');
});

app.get('/secret', isLoggedIn, function(req, res){
    res.render('secret');
});

// ===========
// AUTH ROUTES
// ===========

//Show signup form
app.get('/register', function(req, res){
    res.render("register");
});

app.post('/register', function(req, res){

    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('/register');
        }else{
            passport.authenticate("local")(req, res, function(){
                res.render('secret');
            });
        }
    })
});

//show login form
app.get('/login', function(req, res){
    res.render('login');
});

//login logic using middleware passport
app.post('/login', passport.authenticate('local', {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
  
});

//logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
                

//Listen on port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Running ...")
});