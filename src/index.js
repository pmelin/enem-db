var fs = require('fs');
var csv = require('fast-csv');
var mongoose = require('mongoose');
var School = require('./School');
var files = ["PLANILHA_ENEM_ESCOLA_CH_2015.csv", "PLANILHA_ENEM_ESCOLA_CN_2015.csv", "PLANILHA_ENEM_ESCOLA_LC_2015.csv", "PLANILHA_ENEM_ESCOLA_MT_2015.csv", "PLANILHA_ENEM_ESCOLA_RED_2015.csv"];
var schools = new Map();

mongoose.connect('mongodb://localhost/schoolRanking');
mongoose.connection.on('open', async function() {

    var insert = true;
    for (var file of files) {

        if (insert) {
            await processFile(file, processAndInsert);
            insert = false;
        } else {
            await processFile(file, populateAvg);
        }
    }

    for (var [code, schoolAvgs] of schools) {
        var sumAvg = 0;

        for (var avg of schoolAvgs) {
            sumAvg += avg;
        }

        var school = await School.findOne({code: code});

        //calculates general average
        school.average = sumAvg / schoolAvgs.length;
        await school.save();

    }

});

function processFile(file, callback) {
    return new Promise(function(resolve) {
        console.log('Processing: ' + file)
        var parsingOptions = {
            headers: true,
            delimiter: ';',
            objectMode: true
        };

        var stream = fs.createReadStream("files/" + file);

        var csvStream = csv(parsingOptions).on("data", function(data) {
            callback(data);
        }).on("end", function() {
            resolve();
        });

        stream.pipe(csvStream);
    });
}

/*
Process each school considering csv headers
*/
function processRow(data) {
    return new School({
        code: data['CÓDIGO DA ENTIDADE'],
        name: data['NOME DA ENTIDADE'],
        uf: data['SIGLA DA UF'],
        municipality: data['NOME MUNICÍPIO'],
        adminDependency: data['DEPENDÊNCIA ADMINISTRATIVA'],
        participationRate: data['TAXA DE PARTICIPAÇÃO'],
        permanenceRate: data['INDICADOR DE PERMANÊNCIA NA ESCOLA'],
        teacherTraining: data['INDICADOR DE FORMAÇÃO DOCENTE'],
        approvalRate: data['TAXA DE APROVAÇÃO'],
        disapprovalRate: data['TAXA DE REPROVAÇÃO'],
        abandonmentRate: data['TAXA DE ABANDONO'],
        average: data['MÉDIA ESCOLA']
    });
}

/*
Process the first csv file
*/
async function processAndInsert(data) {
    var school = processRow(data);
    schools.set(school.code, [school.average]);
    await school.save();
}

/*
Process remaining csv files
*/
async function populateAvg(data) {
    var csvSchool = processRow(data);
    var avgPerFile = schools.get(csvSchool.code);
    avgPerFile.push(csvSchool.average);
    schools.set(csvSchool.code, avgPerFile);
}
