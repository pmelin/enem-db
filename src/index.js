var fs = require('fs');
var csv = require('fast-csv');
var mongoose = require('mongoose');
var School = require('../models/School');

mongoose.connect('mongodb://localhost/schoolRanking');
mongoose.connection.on('open', function() {
    let parsingOptions = {
        headers: true,
        delimiter: ';',
        objectMode: true
    };

    var stream = fs.createReadStream("files/test.csv");

    var csvStream = csv(parsingOptions).on("data", function(data) {
        processRow(data);
    }).on("end", function() {
        console.log("done");
    });

    stream.pipe(csvStream);

});

async function processRow(data) {
    try {
        var school = new School({
            code: data['CÓDIGO DA ENTIDADE'],
            name: data['NOME DA ENTIDADE'],
            uf: data['SIGLA DA UF'],
            municipality: data['NOME MUNICÍPIO'],
            adminDependency: data['DEPENDÊNCIA ADMINISTRATIVA'],
            participationRate: replacePontuation(data['TAXA DE PARTICIPAÇÃO']),
            permanenceRate: data['INDICADOR DE PERMANÊNCIA NA ESCOLA'],
            teacherTraining: replacePontuation(data['INDICADOR DE FORMAÇÃO DOCENTE']),
            approvalRate: replacePontuation(data['TAXA DE APROVAÇÃO']),
            disapprovalRate: replacePontuation(data['TAXA DE REPROVAÇÃO']),
            abandonmentRate: replacePontuation(data['TAXA DE ABANDONO']),
            average: replacePontuation(data['MÉDIA ESCOLA'])
        });

        await school.save();
    } catch (err) {
        console.log('Error processing ' + err);
    }
}

function replacePontuation(columnName) {
    try {
        columnName = columnName.replace(/,/g, '.');
        return columnName;
    } catch (err) {
        console.log('Error replacing pontuation')
    }
}
