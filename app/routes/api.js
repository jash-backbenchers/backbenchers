var config=require('../../config');
var User=require('../models/user');
var notes=require('../models/pdf');
var gm = require('gm');
var multer = require('multer');

var middleware=require('../middleware/middleware');




module.exports=function(app,express) {
	var api=express.Router();

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './profilepics/');
        },
        filename: function (req, file, cb,fields,res) {
        	
            var datetimestamp = Date.now();
            var d=new Date(datetimestamp);
            var date=d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
            cb(null, req.decoded.username + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        	gm('./profilepics/'+req.decoded.username + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]+'[0]') // The name of your pdf
		    .setFormat("jpg")
		    .resize(200) // Resize to fixed 200px width, maintaining aspect ratio
		    .quality(100) // Quality from 0 to 100
		    .write('./public/thumnail/'+req.decoded.username + '-' + datetimestamp + '.jpg', function(error){
		        // Callback function executed when finished
		        if (!error){ 
                    console.log("Finished saving JPG"+req.decoded.username + '-' + datetimestamp);
                    User.findByIdAndUpdate(req.decoded._id, { name:req.body.displayname,picstamp:datetimestamp }, function(err, user) {
					  if (err) 
					  	console.log(err);

					  // we have the updated user returned to us
					  console.log(user);
					});
				}
			});
			gm('./profilepics/'+req.decoded.username + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]+'[0]') // The name of your pdf
		    .setFormat("jpg")
		    .resize(16) // Resize to fixed 200px width, maintaining aspect ratio
		    .quality(70) // Quality from 0 to 100
		    .write('./public/thumnail/'+req.decoded.username + '-' + datetimestamp + '16x16.jpg', function(error){
		        // Callback function executed when finished
		        if (!error){ 
                    console.log("Finished saving JPG"+req.decoded.username + '-' + datetimestamp);
                   
				}
			});                    

        }

    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
    
    api.post('/edit',middleware.requireLogin,function(req, res) {
    	
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});

        });
    });


	api.post('/signup',function(req,res) {
		var user=new User({
			name:req.body.name,
			username:req.body.username,
			password:req.body.password,
			timestamp:Date.now()
		});
		var suser=new User({
			name:req.body.name,
			username:req.body.username
		});
		console.log(user);
		user.save(function(err) {
			if(err)
			{
				if(err.code===11000)
				{
					res.json({
						message:'This username is already taken',
						success:false
						});

					return;
				}
				res.json(err);
			}
			var token=middleware.createToken(suser);
			res.json({
				success:true,
				message:'user has been created',
				token:token
			});

		});
	});


		
	

	api.get('/loginusers',middleware.requireLogin,function(req,res) {
		User.find({},function(err,users) {
			if(err)
			{
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.get('/me',middleware.requireLogin,function(req,res) {
			var me=req.decoded;
			res.json(me);
		});

	

	api.get('/getUser/:username',middleware.requireLogin,function(req,res) {
		
		User.findOne({username:req.params.username},function(error, user) {
                if(error)
                {
                    res.send(err);
                    return;
                }
                else
                {
                	notes.find({username:req.params.username},function(error, books) {
                if(error)
                {
                    res.send(err);
                    return;
                }
                else
                {
                	console.log(user);
                    res.json({
                        data:books,
                        user:user,
                        success:true
                    });
                }
            });
                    
                }
            });
		
	});

	

	api.post('/login',function(req,res) {
		
		User.findOne({username:req.body.username}).select('password').exec(function(err,user) {
			if(err)
				throw err;
			if(!user)
				res.send({message:'please enter a valid usernmae',success:false});
			else if(user)
			{
				var valid=user.comparePasswords(req.body.password);
				if(!valid)
					res.send({message:'invalid username or password',success:false});
				else
				{
					User.findById(user._id,function(err,user) {
						if(err){
							console.log(err);
							return;
						}
						var token=middleware.createToken(user);
						res.json({
							success:true,
							message:'sucessfully logged in',
							token:token
						});
					});	
				}
			}
		});
	});

	return api;
}