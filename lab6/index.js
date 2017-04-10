const express = require('express');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const csrf = require('csurf');
const path=require('path');
const ejs = require('ejs');
const fs=require('fs');
const validator = require('express-validator');

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

app.get('/', function(req, res){
	res.redirect('/contactus');
});

app.get('/contactus', function(req, res, next){
	//res.sendFile(__dirname + '/index.html');
	//res.render('index', { csrfTokenFromServer: req.csrfToken() } );
	res.render('form', {errors: null, csrfToken: req.csrfToken()});
});

app.post('/contactus', function(req, res){
	//check express-validator
	req.assert('fullname', 'name is required').notEmpty();
	req.assert('message', 'message is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		console.log(errors);
		res.render('form', {errors: errors, csrfToken: req.csrfToken()});
	}
	else{
	var data = req.body;
	data.ip = req.ip;
	var writable = fs.createWriteStream('data.txt');
	writable.write(JSON.stringify(data));

	var name = req.body.fullname;
	console.log(name);
	res.send("Thank you " + name);
	res.end();
	}
});

app.get('/thankyou', function(req, res){

});