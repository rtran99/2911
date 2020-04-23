const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const MovieRepo      = require('../Data/MoviesRepo');
const UserRepo = require('../Data/UserRepo');
const _MoviesRepo     = new MovieRepo
const _UserRepo = new UserRepo();

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

//Handles POST and updates user information
exports.UpdateUser = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);
    if(reqInfo.authenticated) {
        let ID = req.user._id
        let tempUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email
        })
        let responseUser = await _UserRepo.update(tempUser, ID)
        res.redirect('/User/Login?errorMessage=Please ' + 
                     'login again with your updated credentials.')
    } else {
        res.redirect('/User/Login?errorMessage=Updating ' + 
                     'credentials did not work properly.')
    }
}

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/User/SecureArea'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/User/SecureArea', 
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

//Shows user's reviews only when logged in
exports.reviews = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);
    let userID = req.user._id

    if(reqInfo.authenticated){
        let movies = await _MoviesRepo.allMovies();
        if(movies!= null){
            let reqInfo = RequestService.reqHelper(req);
            res.render('User/reviews', {movies:movies, reqInfo:reqInfo, userID:userID})
        }
        else{
            res.redirect('/User/Login?errorMessage=You ' + 
            'must be logged in to view this page.')
        }
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
        'must be logged in to view this page.')
    }
}

//Shows the user profile edit page
exports.Profile = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated){
        res.render('User/Profile', {user:{}, reqInfo:reqInfo})
    }
    else{
        res.redirect('/User/Login?errorMessage=You ' + 
        'must be logged in to view this page.')
    }
}

//Shows the review writing page only if logged in
exports.WriteReview = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated){
        let movieNamerequest = req.query._movieName
        let movieName = await _MoviesRepo.getMovies(movieNamerequest);
        return res.render('User/WriteReview', {movies:movieName, reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
        'must be logged in to view this page.')
    }
}

//Handles POST and submits review to Movie schema
exports.SubmitReview = async function(req, res){
    let reqInfo = RequestService.reqHelper(req)

    let movieName = req.body._movieName
    let review = req.body.review
    let rating = req.body.rating
    let username = reqInfo.username
    let userID = req.user._id

    //Call reviewArray function in MoviesRepo.js to submit review
    let response = await _MoviesRepo.reviewArray(movieName, review, rating, username, userID)
    if(response.errorMessage == ""){
        res.redirect('/')
    } else {
        res.redirect('/?errorMessage='+response.errorMessage)
    }
    
}

//Shows review editing page only if logged in
exports.EditReview = async function(req, res){
    let reqInfo = RequestService.reqHelper(req)
    
    if(reqInfo.authenticated){
        let movieNamerequest = req.query._movieName
        let movieName = await _MoviesRepo.getMovies(movieNamerequest);
        return res.render('User/EditReview', {movies:movieName, reqInfo:reqInfo})
    } else {
        res.redirect('/User/Login?errorMessage=You ' + 
        'must be logged in to view this page.')
    }
}

//Handles POST and updates the review
exports.UpdateReview = async function(req, res){
    let reqInfo = RequestService.reqHelper(req)

    let movieName = req.body._movieName
    let review = req.body.review
    let rating = req.body.rating
    let username = reqInfo.username
    let userID = req.user._id
    //Calls UpdateReview function in MoviesRepo to update the review
    let response = await _MoviesRepo.UpdateReview(movieName, review, rating, username, userID)
    if(response.errorMessage == ""){
        res.redirect('/')
    } else {
        res.redirect('/?errorMessage='+response.errorMessage)
    }
}

//Handles POST and deletes the review
exports.DeleteReview = async function(req, res){
    let reqInfo = RequestService.reqHelper(req)

    let movieName = req.body._movieName
    let userID = req.user._id

    _MoviesRepo.DeleteReview(movieName, userID)
    res.redirect('/')
}