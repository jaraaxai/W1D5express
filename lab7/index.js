const express = require('express');
const crypto = require('crypto');
const mongoskin = require('mongoskin');


const app = express();

app.listen(3000, function(){
	console.log('app is started 3000 port');
});

var db=mongoskin.db('mongodb://localhost:27017/library', {native_parser: true});

db.bind('student');

app.get('/', function(req, res, next){

    db.student.findOne({}, function(err, item){

        var text = item.message;
        var decipher = crypto.createDecipher('aes256','asaadsaad');
	    var dec = decipher.update(text,'hex','utf8');
	    dec += decipher.final('utf8');
        res.send(dec);
        db.close();
    })
})





