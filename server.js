// required modules
var express = require('express');
var mongoose = require('mongoose');
var engine = require('ejs-locals');
var http = require('http');

// connect to MongoDB
var db = 'chatdb';
//mongoose.connect('mongodb://localhost/'+db);
mongoose.connect('mongodb://manoj:manoj@ds039231.mongolab.com:39231/chatdb');
// initialize our app
var app = express();

// app configuation
app.engine('ejs', engine);
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'coloft'}));

// port that server will listen on
var port = 4020;

// start listening...
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var compId;
server.listen(process.env.PORT || port );
console.log('Express server listening on port '+port);


// create user model 
var User = mongoose.model('User', {
	username: String,
	password: String,
        email:String,
	companyId:String,
	company:String

});


var Retailer = mongoose.model('Retailer',
			   { _id: String,companyId: String, 
			   	name: String, username: String,
			    spid: Array}, 'retailer');  

app.get('/', function (req, res) {
	
	if (req.session.user){
    
		Retailer.find({}).execFind(function (err, retailers){
			res.render('homepage.ejs', {user: req.session.user, retailers: retailers});
		});

	} else {
	
		res.render('welcome.ejs');
	}
	
});

User.findOne({username:"manoj"},function(err,users){

	console.log('username:%s',users.username);

});



app.get('/logout', function (req, res) {

	if (req.session.user) {
		console.log(req.session.user.username+' has logged out');
		delete req.session.user;
	}

	res.redirect('/');

});

app.get('/login', function (req, res) {

	var error1 = null;
	var error2 = null;

	if (req.query.error1) {
		error1 = "Sorry please try againx";
	}

	if (req.query.error2) {
		console.log(req.query);
		error2 = "Sorry please try againy";
	}
	console.log('in login before login.ejs');
	res.render('login.ejs', {error1: error1, error2: error2});

});

app.get('/forget',function(req,res) {

	var error1 = null;

		res.render('forget.ejs', {error1: error1});

});


app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	    comId    = req.body.company;

    console.log("username :%s",username );
    console.log("password :%s",password );
    console.log("comId    :%s",comId);
	var query = {username: username, password: password};
	
	var errorMsg = { 
						error: true,
						username: req.body.username,
						message: "Not a valid user"
					};
    

	User.findOne(query, function (err, user) {

		if (err || !user || username == '') {
			  res.send(errorMsg);
		} else {

			req.session.user = user;
			console.log(username+' is valid');
			errorMsg.error = false;
			errorMsg.message = "valid user";
			res.send(errorMsg);
		}

	});
});
app.get('/users/:username', function (req, res) {

	if (req.session.user) {

		var username = req.params.username.toLowerCase();
		var query = {username: username};
		var queryCompany = {companyId: comId};
		var currentUser = req.session.user;

		console.log('companyId:%s',comId);

		User.findOne(query, function (err, user) {

			if (err || !user) {
				res.send('No user is found by id '+username);
			} else {

					Retailer.find(queryCompany,function(err, retailers) {
						console.log(retailers);
						// if there is an error retrieving, send the error. nothing after res.send(err) will execute
						if (err)
							res.send(err)
						else{
								res.render('profile.ejs',{
								currentUser: currentUser,
								retailers:retailers,
								companyId:comId
							});
						}
					});
				}	
		});
	} else {

		res.redirect('/login');

	}
});
app.post('/findpass',function(req,res) {
	var fusername = req.body.username.toLowerCase(),
	    fpass;

	    console.log("fusername:%s",fusername );
	    var query = {username:fusername};
	    User.findOne(query,function(err,user){

	    	if(err || !user || fusername == ''){
	    		res.redirect('/findpass?error2=1');
	    	} else{
	    		fpass=user.password;
	    		console.log("fpassword:%s",user.password);

	    		res.render('showpass.ejs',{fusername:user.username,fpass:user.password});

	    	}

	    });

});


app.post('/checkuser', function (req, res){

	var username = req.body.username.toLowerCase();
    console.log('username:' + username);

		var query = {username: username};

		User.findOne(query, function (err, user) {
			var userFlag,
				existFlag;
			if (user) {
				  existFlag = {userFlag:true};	
				  res.send(existFlag);
			} else {
					existFlag = {userFlag:false};
				   res.send(existFlag);					
				};

		});
});

/* new signup */
app.post('/signup', function (req, res){


	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var confirm = req.body.confirm;
    var email   = req.body.email;
    var company = req.body.company;
    var companyId = req.body.companyId;

    console.log('companyId:' + companyId);
    console.log('username:' + username);

		var query = {username: username};

		User.findOne(query, function (err, user) {
			var userFlag,
				existFlag;

			if (user) {
				  existFlag = {userFlag:true};	
				  res.send(existFlag);
			} else {

				var userData = { 
					username: username,
					password: password,
					email: email,
					company: company,
					companyId:companyId,
					hidden: false
				};

				var newUser = new User(userData).save(function (err){

					req.session.user = userData;
					console.log('New user '+username+' has been created!');
					existFlag = {userFlag:false};	
					res.send(existFlag);

				});
			}
		});
});



