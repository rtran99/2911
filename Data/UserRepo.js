const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }

    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }


    async update(editedUser, ID){
        let response = {
            obj: editedUser
        }

        let updated = await User.updateOne(
            {_id:ID},
            {$set: {
                firstName: editedUser.firstName,
                lastName: editedUser.lastName,
                username: editedUser.username,
                email: editedUser.email}
            })
        if(updated.nModified!=0){
            response.obj = editedUser
            return response
        } else {
            console.log('something happened :(')
        }

    }
}
module.exports = UserRepo;

