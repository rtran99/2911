const RequestService = require('../Services/RequestService');
const User           = require('../Models/User');
var   passport       = require('passport');
const MovieRepo      = require('../Data/MoviesRepo');
const _MoviesRepo     = new MovieRepo


//Shows Index page
exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage
    let movies = await _MoviesRepo.allMovies()
    return res.render('Home/Index', { movies:movies, reqInfo:reqInfo, errorMessage:errorMessage});
};

//Shows all reviews for a movie
exports.ReviewListing = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let movieNamerequest = req.query._movieName
    let movieName = await _MoviesRepo.getMovies(movieNamerequest);
    return res.render('Home/ReviewListing', { movies:movieName, reqInfo:reqInfo})
}
