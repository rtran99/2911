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

    async getRolesByUsername(username) {
        var user = await User.findOne({username: username}, {_id:0, roles:1});
        if(user.roles) {
            return user.roles;
        }
        else {
            return [];
        }
    }    

    async getBitcoin(email) {
        var user = await User.findOne({email: email});
        
        let bitcoin = user.bitcoin
        console.log(bitcoin)

        return bitcoin
    }

    async saveProgress(email, bitcoin) {
        let updated = await User.updateOne(
            { email:email},
            {$set: {bitcoin:bitcoin}}
        )
        return "Progress has been saved. You can safely close the browser."
    }
}
module.exports = UserRepo;

