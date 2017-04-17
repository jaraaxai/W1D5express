var express = require('express');
var fs=require('fs');
var app = express();

app.listen(3000, function(){
	console.log('Running %s', 3000);
});

app.set('myname', 'MiGa');
app.enable('etag');
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.enable('case sensitive routing');
app.set('x-powered-by', false);
app.set('strict routing', true);
app.set('query parser', 'simple');

app.get('/inventors', function(request, response){
	var filepath = __dirname + '/inventors.json';
    var fn = s => response.send(s);
    var encoding = 'utf8';
    var file = fs.readFileSync(filepath, encoding);
    fn(JSON.parse(file));
	response.end();
});

