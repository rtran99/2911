var mongoose              = require('mongoose');

// User Schema
var movieSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    movieName: {
        type: String
    },
    reviewArray: []
},
{
    versionKey: false
});
var Movie = module.exports = mongoose.model('movies', movieSchema);
module.exports = Movie;
