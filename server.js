var gm = require('gm');
var express=require('express');
var bodyParser=require('body-parser');
var morgan=require('morgan');
var fs=require('fs'); 
var config=require('./config');
var mongoose=require('mongoose');
var multer = require('multer');
var api=require('./app/routes/api')(app,express);
var apicontact=require('./app/routes/api.contact')(app,express);
var apinotes=require('./app/routes/api.pdf')(app,express);

var middleware=require('./app/middleware/middleware');

var app=express();
//mongoose.connect('mongodb://jaswanth.chodavarapu143:jaswanth143xxx@ds031965.mlab.com:31965/backbenchers',function(err) {
mongoose.connect('mongodb://localhost:27017/myapp',function(err) {
	if(err)
		console.log(err);
	console.log('connected to database');
});

var http=require('http').Server(app);
var io=require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.get('/',function(req,res,next) {
	req.url="/public";
	next();
});





app.use('/public',express.static(__dirname+"/public")); 
app.use('/pdf',middleware.requireLogin,express.static(__dirname+"/pdf"));
app.use(morgan('dev'));
app.use('/api',api);
app.use('/api/contacts',apicontact);
app.use('/api/notes',apinotes);
//app.use('/api/socketio',apisocketio);
app.get('*',function(req,res,next) {
	res.sendFile(__dirname+"/public/index.html");
});




var users=[];


io.on('connection',function(Socket) {
	
	var username='';

	Socket.on('users',function(data) {
		io.emit('users',users);
	});

	Socket.on('add-user',function(data) {
		if ( users.indexOf(data.user)== -1) {
			console.log("data is....");
			console.log(data);
			users.push(data.user);
			Socket.username=data.user;

		}
		io.emit('update-adduserlist',data.user);
	});

	Socket.on('del-user',function(data) {
		users.splice(users.indexOf(data.user),1);
		io.emit('update-deluserlist',data.user);
	});

		

	Socket.on('disconnect',function() {
		users.splice(users.indexOf(Socket.username),1);
		io.emit('update-deluserlist',{username:Socket.username});
		console.log('a user is disconnected from socket io '+Socket.username);
		console.log(users.indexOf(Socket.username));
	});
	Socket.on('message',function(data) {
		console.log(data);
		io.emit('message',data);
	});
});







http.listen(config.port);
console.log('listening on port 3000');