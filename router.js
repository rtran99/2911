var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/SecureArea', UserController.SecureArea);
    app.get('/User/reviews', UserController.reviews);
    app.get('/User/Profile', UserController.Profile);
    app.post('/User/UpdateUser', UserController.UpdateUser);
    app.get('/Home/ReviewListing', HomeController.ReviewListing);
    app.get('/User/WriteReview', UserController.WriteReview);
    app.post('/User/SubmitReview', UserController.SubmitReview)
    app.get('/User/EditReview', UserController.EditReview);
    app.post('/User/UpdateReview', UserController.UpdateReview);
    app.post('/User/DeleteReview', UserController.DeleteReview);
};
