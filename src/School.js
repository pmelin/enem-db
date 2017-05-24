var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
    code: {
        type: Number
    },
    name: {
        type: String
    },
    uf: {
        type: String
    },
    municipality: {
        type: String
    },
    adminDependency: {
        type: String
    },
    participationRate: {
        type: Number
    },
    permanenceRate: {
        type: String
    },
    teacherTraining: {
        type: Number
    },
    approvalRate: {
        type: Number
    },
    disapprovalRate: {
        type: Number
    },
    abandonmentRate: {
        type: Number
    },
    average: {
        type: Number
    }
});

module.exports = mongoose.model('School', SchoolSchema);
