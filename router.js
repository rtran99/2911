var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');
var GameController = require('./Controllers/GameController')
const authMiddleware = require('./authHelper')
const cors = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', cors(), UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/SecureArea', UserController.SecureArea);

    app.post('/User/getBitcoin', cors(), UserController.getBitcoin);
    app.post('/User/saveProgress', cors(), UserController.saveProgress)
    app.get('/Game/getItems', cors(), GameController.getItems)
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
        )

    // Accessible to authenticated user. CORS must be enabled 
    // for client App to access it.
    app.get('/User/SecureAreaJwt', cors(),  
        authMiddleware.requireJWT, UserController.SecureAreaJwt)

    // Accessible to manager or admin. CORS must be enabled for 
    // client App to access it.
    app.get('/User/ManagerAreaJwt', cors(), 
        authMiddleware.requireJWT, UserController.ManagerAreaJwt)
    
    // Receives posted data from authenticated users.
    app.post('/User/PostAreaJwt', cors(), 
        authMiddleware.requireJWT, UserController.PostAreaJwt)

};
