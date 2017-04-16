const express = require('express');
const mongoskin = require('mongoskin');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const csrf = require('csurf');
const path=require('path');
const ejs = require('ejs');
const fs=require('fs');
const validator = require('express-validator');

var db=mongoskin.db('mongodb://localhost:27017/local', {native_parser: true});
db.bind('locations');

const app = express();
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(cookieParser('randomStringisHere222'));
app.use(csrf());

//template engine
//app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//express-validator
app.use(validator());

app.listen(3000, function(){
	console.log('app is started 3000');
});

app.post('/add', function(req, res){
	//check express-validator
	req.assert('fullname', 'name is required').notEmpty();
	req.assert('lat', 'Latitude is required').notEmpty();
	req.assert('lon', 'Longitude is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		db.locations.find().toArray(function(err, results){
    		res.render('form', {errors: errors, csrfToken: req.csrfToken(), results: results});
    	});
	}
	else{
	
	var name = req.body.fullname;
	var type = req.body.type;
	var lat = req.body.lat;
	var lon = req.body.lon;
	lat=lat*1.0;
	lon=lon*1.0;
	var location = { "name": name, "category":type, loc: {"lat" : lat, "long": lon}};
	
		db.locations.insertOne(location, function(err, records){
			
			res.redirect('/');

		});
	}
});

app.post('/update', function(req, res){
	//check express-validator
	req.assert('fullname', 'name is required').notEmpty();
	req.assert('lat', 'Latitude is required').notEmpty();
	req.assert('lon', 'Longitude is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		db.locations.find().toArray(function(err, results){
    		res.render('form', {errors: errors, csrfToken: req.csrfToken(), results: results});
    	});
	}
	else{
	var _id = req.body.id;
	var name = req.body.fullname;
	var type = req.body.type;
	var lat = req.body.lat;
	var lon = req.body.lon;
	lat=lat*1.0;
	lon=lon*1.0;
	var location = {$set: { "name": name, "category":type, loc: {"lat" : lat, "long": lon}}};
	
		db.locations.findOneAndUpdate({ "_id" : new ObjectId(_id) }, location);

		res.redirect('/');
		
	}
});

var ObjectId = require('mongodb').ObjectId; // or ObjectID // or var ObjectId = require('mongodb').ObjectId if node version < 6

app.get('/', function(req, res, next){

    db.locations.find().toArray(function(err, results){
    	res.render('form', {errors: null, csrfToken: req.csrfToken(), results: results});
    });
});

app.get('/delete/:id', function(req, res){
	
	db.locations.removeOne({ "_id" : new ObjectId(req.params.id) }, function(err, result) {
	    
	});
    res.redirect('/');
});

app.get('/edit/:id', function(req, res){

	db.locations.findOne({ "_id" : new ObjectId(req.params.id) }, {}, function(err, result) {
	    res.render('edit', {errors: null, csrfToken: req.csrfToken(), location: result});
	});
    
});






