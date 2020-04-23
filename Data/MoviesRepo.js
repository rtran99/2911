const Movie = require('../Models/Movie');

class MoviesRepo {
    MoviesRepo() {        
    }

    //gets ALL movies
    async allMovies() {
        let movies = await Movie.find().exec();
        return movies

    }
    //Gets a movie by it's name
    async getMovies(movieName){
        let movies = await Movie.findOne({movieName:movieName}).exec();
        return movies

    }

    //Create review array and submit it to schema
    async reviewArray(movieName, review, rating, username, userID) {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //Gets current movie review array
        let movies = await Movie.findOne({movieName:movieName}).exec()
        let reviewArray = movies.reviewArray
        let errorMessage = {errorMessage: ""}

        //Check if user already submitted by checking if review userID matches user's userID
        let userAlreadySubmitted = false
        //Go through all reviews in the review array and check their userID
        for(var i=0; i<movies.reviewArray.length; i++){
            if(JSON.stringify(movies.reviewArray[i].userID) == JSON.stringify(userID)){
                userAlreadySubmitted = true
            }
        }

        //Makes sure floats are not accepted
        rating = parseFloat(rating)
        if(rating % 1 != 0){
            errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
            return errorMessage
        }
        //Make rating value an int
        rating = parseInt(rating)
        //Check if rating is a number
        if(Number.isInteger(rating) != true){
            errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
            return errorMessage
        } else {
            //Check if number is not NaN, smaller than 1 or greater than 5
            if ((isNaN(rating)) || rating < 1 || rating > 5) {
                errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
                return errorMessage
            } else {
                if(userAlreadySubmitted == true){
                    errorMessage.errorMessage = 'User already submitted'
                    return errorMessage
                } else {
                    //If there is no pre-existing review array (first review of movie), make a new one
                    if(reviewArray==undefined){
                        reviewArray = []
                    }
                    //Make a new object containing review, rating, username, date, and user ID
                    let newReviewObj = {
                        'review':review,
                        'rating':rating,
                        'username':username,
                        'date':date,
                        'userID':userID}
                    //Add the review object to the end of the review array
                    reviewArray.push(newReviewObj)
                    //Update the movie schema with the new review array
                    let updated = await Movie.updateOne(
                        {_id:movies.id},
                        {$set: {reviewArray:reviewArray}}
                    );
                return errorMessage
                }
            }
        }
    }

    //Update the review array with the edited review added
    async UpdateReview(movieName, review, rating, username, userID){
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //Gets current movie review array
        let movies = await Movie.findOne({movieName:movieName}).exec()
        let reviewArray = movies.reviewArray
        //Make a new array to act as the "updated array"
        let newArray = []
        let errorMessage = {errorMessage:""}

        //Makes sure floats are not accepted
        rating = parseFloat(rating)
        if(rating % 1 != 0){
            errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
            return errorMessage
        }
        //Make rating value an int
        rating = parseInt(rating)
        //Check if rating is a number
        if(Number.isInteger(rating) != true){
            errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
            return errorMessage
        } else {
            //Check if number is not NaN, smaller than 1 or greater than 5
            if ((isNaN(rating)) || rating < 1 || rating > 5) {
                errorMessage.errorMessage = 'Rating must be a whole number and between 1-5'
                return errorMessage
            } else {
                //Make a new object containing review, rating, username, date, and user ID
                let newReviewObj = {
                    'review':review,
                    'rating':rating,
                    'username':username,
                    'date':date,
                    'userID':userID}
                //Go through each review in the review array.
                //If the review userID matches the user's userID, add the new object to the end of the new array.
                //If the review userID doesn't match the user's userID, add that review object to the end of the new array.
                for(var i=0; i < reviewArray.length; i++){
                    if(JSON.stringify(reviewArray[i].userID) == JSON.stringify(userID)){
                     newArray.push(newReviewObj)
                    } else {
                        newArray.push(reviewArray[i])
                    }
                }
                //Update the movie schema with the new review array
                let updated = await Movie.updateOne(
                    {_id:movies.id},
                    {$set: {reviewArray:newArray}}
                )

                return errorMessage
            } 
        }
    }

    //Delete a review according to userID
    async DeleteReview(movieName, userID){
        //Gets current movie review array
        let movies = await Movie.findOne({movieName:movieName}).exec()
        let reviewArray = movies.reviewArray
        //Make a new array to act as the "updated array"
        let newArray = []

        //Go through all reviews in the array
        //If review userID does not match user's user ID, add the review object to the new array.
        //If review userID does match user's user ID, don't add it.
        for(var i=0; i < reviewArray.length; i++){
            if(JSON.stringify(reviewArray[i].userID) != JSON.stringify(userID)){
                newArray.push(reviewArray[i])
            }
        //Update the movie schema with the new review array
        let updated = await Movie.updateOne(
            {_id:movies.id},
            {$set: {reviewArray:newArray}}
        )
        }
    }

}

module.exports = MoviesRepo;


