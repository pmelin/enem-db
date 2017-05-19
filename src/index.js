var fs = require('fs');
var csv = require('fast-csv');

var stream = fs.createReadStream("files/test.csv");

var csvStream = csv({headers:true, delimiter:';', objectMode:true})
    .on("data", function(data){
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });

stream.pipe(csvStream);
