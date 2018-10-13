var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    
mongoose.connect("mongodb://localhost/auth_demo_app");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var me2Schema=new mongoose.Schema({
person: String,
twitterAccount: String,
profession: String,
sourceLink: String
});

var me2= mongoose.model("me2", me2Schema);

//============
// ROUTES
//============
app.get("/me2India",function(req,res){
    me2.find({}, function(err,allme2){
       if(err){
           console.log(err);
       }else{
          res.render("home.ejs",{thingVar:allme2}); 
       }
    })
    
});

// LOGIN ROUTES
//render login form
app.get("/", function(req, res){
   res.render("login"); 
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret"); 
});


app.post("/newAllegedPerson", function(req,res){
    var twitterLink=req.body.twitterLink;
    var prof=req.body.prof;
    var sourceLink=req.body.sourceLink;
    var person=req.body.newName;
    var newAlleged={person:person,
                    twitterAccount:twitterLink,
                    profession:prof,
                    sourceLink:sourceLink};
    me2.create(newAlleged,function(err,newUser){
        if(err){
            console.log("error occuring");
            console.log(err);
        }
        else{
            res.render("post.ejs");
        }
    })
});


app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
})