//-------------------------------- server require ---------------------------------
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var morgan = require('morgan');

//-------------------------------- database ---------------------------------
var mongodb = require('mongodb');
var assert = require('assert');
var client = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/dispatchr';

//-------------------------------- server setting ---------------------------------
var app = express();
app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//-------------------------------- server middleware ---------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('cookie'));
app.use(session({secret: 'secret',
				resave: true,
				saveUninitialized: true}
				));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(morgan('combined'));

//-------------------------------- routes ---------------------------------
app.get('/', function(req, res){
	res.render(app.get('views') + '/main.jade');
});

app.get('/showAll', function(req, res){
	client.connect(url, function(err, db){
		db.collection("orders").find().toArray(function(err, data){
			res.send(data);
			db.close();
		});
	});
});

app.post('/addNewCustomer', function(req, res){
	client.connect(url, function(err, db){
		db.collection("customers").insertOne(req.body, function(err, res){
			assert.equal(null, err);	
			assert.equal(1, res.insertedCount);		
			db.close();
		});
		res.sendStatus(200);
	});
});

app.post('/addNewCustomerOrder', function(req, res){
	client.connect(url, function(err, db){
		db.collection("orders").insertOne(req.body, function(err, res){
			assert.equal(null, err);
			assert.equal(1, res.insertedCount);
			db.close();
		});
		res.sendStatus(200);
	});
});

app.post('/addNewOrder', function(req, res){
	client.connect(url, function(err, db){
		db.collection("orders").update(
			{CustomerUsername: req.body.CustomerUsername},
			{$push: {Orders: req.body.NewOrder}},
			function(err, res){
				assert.equal(null, err);			
				db.close();
		});
		res.sendStatus(200);
	});
});

app.post('/getCustomerInfo', function(req, res){
	client.connect(url, function(err, db){
		db.collection("customers").find(req.body).toArray(function(err, data){
			res.send(data);
			db.close();
		});
	});
});

app.post('/updateExCustomer', function(req, res){
	var query = {CustomerUsername: req.body.CustomerUsername};
	client.connect(url, function(err, db){
		db.collection("customers").update(query, req.body, function(err, res){
			assert.equal(null, err);
			db.close();
		});
		res.sendStatus(200);
	});
});

app.post('/deleteExOrder', function(req, res){
	console.log(req.body);
	client.connect(url, function(err, db){
		db.collection("orders").update(
			{CustomerUsername: req.body.CustomerUsername}, 
			{$pull: {Orders: {Key: req.body.Key}}}, 
			function(err, res){
				assert.equal(null, err);
				db.close();
		});
		res.sendStatus(200);
	});
});

app.post('/updateExOrder', function(req, res){
	client.connect(url, function(err, db){
		db.collection("orders").update(
			{
				CustomerUsername: req.body.CustomerUsername, 
				'Orders.Key': req.body.originKey
			},
			{$set: 
				{'Orders.$.OrderName': req.body.OrderName, 
				'Orders.$.Amount': req.body.Amount, 
				'Orders.$.Key': req.body.Key}
			},
			function(err, res){
				assert.equal(null, err);
				db.close();
		});
		res.sendStatus(200);
	});
});

//-------------------------------- port ---------------------------------
app.listen(app.get('port'), function(){
	console.log("listening on port " + app.get('port'));
});