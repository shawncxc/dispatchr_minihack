//-------------------------------- node_modules ---------------------------------
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var morgan = require('morgan');

//-------------------------------- database setting ---------------------------------
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
var customerRt = require('./routes/customerRt');
var orderRt = require('./routes/orderRt');

app.get('/', function(req, res){
	res.render(app.get('views') + '/main.jade');
});
app.post('/addNewCustomer', customerRt.addNewCustomer); //add new customer's info
app.post('/getCustomerInfo', customerRt.getCustomerInfo); //pull customer info
app.post('/updateExCustomer', customerRt.updateExCustomer); //update existing customer info
app.get('/showAll', orderRt.showAll); //show all the orders
app.post('/addNewCustomerOrder', orderRt.addNewCustomerOrder); //add new customer's first order
app.post('/addNewOrder', orderRt.checkExCustomer, orderRt.addNewOrder); //add new order for existing customer
app.post('/deleteExOrder', orderRt.deleteExOrder); //delete existing order
app.post('/updateExOrder', orderRt.updateExOrder); //update existing order

//-------------------------------- port ---------------------------------
app.listen(app.get('port'), function(){
	console.log("listening on port " + app.get('port'));
});