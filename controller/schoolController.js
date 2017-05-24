var School = require('../models/School');

module.exports = {
    list: function(req, res) {
        var viewModel = {
            schools: []
        };
        School.find({}, {}, {}, function(err, schools) {
            if (err) {
                res.send(500, 'Error listing schools ${err}');
            }
            viewModel.schools = schools;
            res.render('schoolList', viewModel);
        });
    }
}
