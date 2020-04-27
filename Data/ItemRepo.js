const Item = require('../Models/Item');

class ItemRepo {
    ItemRepo() {        
    }

    async getItems() {
        let items = await Item.find().exec();
        return items;
    }
}
module.exports = ItemRepo;

