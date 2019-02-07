var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*
var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

app.use(logger);
*/

//view Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
 
 //body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static Path
app.use(express.static(path.join(__dirname, 'public')))

/* array of objects (API)
var people = [
{
	name:'jeff',
	age: 30
},
{
	name:'Sara',
	age: 22
},
{
	name:'Bill',
	age: 40
}s
] */

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split('.')
		,root   = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' +  namespace.shift() +']';
		}
		return {
			param: formParam,
			msg  : msg,
			value: value
		};
	}
}));


var users = [
  {
     id: 1,
     first_name: 'john',
     last_name: 'Doe',
     email: 'johndoe@gmail.com',
 },

  {
     id: 2,
     first_name: 'Bob',
     last_name: 'Munya',
     email: 'bmunya@gmail.com',
 },
  {
     id: 3,
     first_name: 'Sam',
     last_name: 'Lee',
     email: 'samlee@gmail.com',
 }
]

app.get('/', function(req, res){
	db.users.find(function (err, docs) {
/*	    console.log(docs);    */
		res.render('index', {
		    title: 'Customers',
/*db*/	        users: docs
	     });
   })
});

app.post('/users/add',function(req, res){
	/*console.log(req.body.first_name);*/

req.checkBody('first_name', 'First Name is Required').notEmpty();
req.checkBody('last_name', 'last Name is Required').notEmpty();
req.checkBody('email', 'Email is Required').notEmpty();	

var errors = req.validationErrors();

if(errors){
	 res.render('index', {
	   title: 'Customers',
	   users: users,
	   errors: errors
	});
} else {
	var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
	}
		db.users.insert(newUser, function(err, res){
		     if(err){
		      console.log(err);
		      }
		      res.redirect('/');
		});

      }
	
});

app.delete('/users/delete/:id', function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, res){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');

}) 