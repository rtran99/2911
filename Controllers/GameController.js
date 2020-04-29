const RequestService = require('../Services/RequestService');
const Item           = require('../Models/Item');
const ItemRepo       = require('../Data/ItemRepo');
const _itemRepo      = new ItemRepo();


exports.getItems = async function(req, res){
    let items = await _itemRepo.getItems()

    return res.json(items)
}

