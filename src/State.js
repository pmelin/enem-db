var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateSchema = new Schema({
    uf: {
        type: String
    },
    municipalities: [String]
});

module.exports = mongoose.model('State', StateSchema);
