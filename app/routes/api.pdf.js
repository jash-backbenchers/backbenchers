var gm = require('gm');
var notes=require('../models/pdf');
var User=require('../models/user');
var Comments=require('../models/comments');
var multer = require('multer');
var middleware=require('../middleware/middleware');

module.exports=function(app,express) {
	var apinotes=express.Router();
	var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './pdf/');
        },
        filename: function (req, file, cb,fields,res) {
        	
            var datetimestamp = Date.now();
            var d=new Date(datetimestamp
            	);
            var date=d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
            cb(null, req.body.displayname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        	gm('./pdf/'+req.body.displayname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]+'[0]') // The name of your pdf
		    .setFormat("jpg")
		    .resize(200) // Resize to fixed 200px width, maintaining aspect ratio
		    .quality(75) // Quality from 0 to 100
		    .write('./public/thumnail/'+req.body.displayname + '-' + datetimestamp + '.jpg', function(error){
		        // Callback function executed when finished
		        if (!error){ 
                    console.log("Finished saving JPG");
                    var pdf=new notes({
                        user:req.decoded._id,
                        username:req.decoded.username,
                        displayname:req.body.displayname,
                        timestamp:datetimestamp,
                        date:date,
                        tags:req.body.tags

                    });
                    pdf.save(function(err) {
                        if(err)
                        {
                            if(err.code===11000)
                            {
                                res.json({message:'notes already exists'});
                                return;
                            }
                            res.json(err);
                        }

                    });
                    
                }
		       	else 
		            console.log("There was an error!", error);
		    });

        }

    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
    

var multiparty = require('connect-multiparty');
multipartyMiddleware = multiparty();
    /** API path that will upload the files */
    apinotes.post('/upload',middleware.requireLogin,function(req, res) {
    	
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});

        });
    });

    apinotes.get('/all',middleware.requireLogin,function(req, res) {
        
        notes.find({}).populate('comments').exec(function(err,notes) {
            if(err)
            {
                res.send(err);
                return;
            }
            res.json({notes:notes});
        });
    });

    apinotes.get('/bookById/:id',middleware.requireLogin,function(req, res) {
        
        notes.findById(req.params.id).populate('comments').exec(function(err,notes) {
            if(err)
            {
                res.send(err);
                return;
            }
            res.json({book:notes});
        });
    });

    apinotes.put('/tomybag/:id',middleware.requireLogin,function(req,res) {

        User.find({username:req.decoded.username},req.body,function(err,users) {
            users=users[0]; 
            if (users.mybag.indexOf(req.params.id)==-1) {
                console.log("before adding to bag");
                console.log(users.mybag);
                users.mybag.push(req.params.id);
                console.log( users.mybag);
                users.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully added book",
                            action:true,
                            success:true
                        });
                    }
                }); 
            }
            
        });
    });

    apinotes.put('/todelmybag/:id',middleware.requireLogin,function(req,res) {

        User.find({username:req.decoded.username},req.body,function(err,users) {
            console.log("todelmybag");
            users=users[0]; 
            if (users.mybag.indexOf(req.params.id) !=-1) {
                console.log("before deleting from bag");
                console.log(users.mybag);
                users.mybag.remove(req.params.id);
                console.log( users.mybag);
                users.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully added book",
                            success:true
                        });
                    }
                }); 
            }
            
        });
    });


    apinotes.put('/like/:id',middleware.requireLogin,function(req,res) {
        notes.findById(req.params.id,req.body,function(err,notespdf) {
            console.log(notespdf);
            if (notespdf.likes.indexOf(req.decoded._id)==-1) {
                console.log("before like");
                console.log(notespdf.likes);
                notespdf.likes.push(req.decoded._id);
                console.log(notespdf.likes);
                notespdf.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully liked book",
                            action:true,
                            success:true
                        });
                    }
                }); 
            }
            else
            {
               console.log("before dislike");
                console.log(notespdf.likes);
                notespdf.likes.splice(notespdf.likes.indexOf(req.decoded._id),1);
                console.log(notespdf.likes);
                notespdf.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully disliked book",
                            action:false,
                            success:true
                        });
                    }
                }); 
            }
            
        });
    });

    apinotes.put('/dislike/:id',middleware.requireLogin,function(req,res) {

        notes.findById(req.params.id,req.body,function(err,notespdf) {
            
            if (notespdf.dislikes.indexOf(req.decoded._id)==-1) {
                console.log("before dislike");
                console.log(notespdf.dislikes);
                notespdf.dislikes.push(req.decoded._id);
                console.log(notespdf.likes);
                notespdf.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully disliked book",
                            action:true,
                            success:true
                        });
                    }
                }); 
            }
            else
            {
               console.log("before dislike again");
                console.log(notespdf.dislikes);
                notespdf.dislikes.splice(notespdf.dislikes.indexOf(req.decoded._id),1);
                console.log(notespdf.dislikes);
                notespdf.save(function (err) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        res.json({
                            message:"successfully disliked again book",
                            action:false,
                            success:true
                        });
                    }
                }); 
            }
            
        });
    });

    apinotes.get('/tomybag',middleware.requireLogin,function(req,res) {

        User.find({username:req.decoded.username},req.body,function(err,user) {
                user=user[0];
                if(err)
                {
                    res.send(err);
                    return;
                }
                else
                {
                    res.json({
                         mybag:user.mybag,
                        success:true
                    });
                }
            });
                
        });

    apinotes.get('/tomybag1',middleware.requireLogin,function(req,res) {

        User.find({username:req.decoded.username})
            .populate('mybag')
            .exec(function(error, books) {
                console.log(books);
                if(error)
                {
                    res.send(err);
                    return;
                }
                else
                {
                    res.json({
                        data:books,
                        success:true
                    });
                }
            })
                
        });

    apinotes.get('/mybooks',middleware.requireLogin,function(req,res) {

        notes.find({username:req.decoded.username},function(error, books) {
                if(error)
                {
                    res.send(err);
                    return;
                }
                else
                {
                    res.json({
                        data:books,
                        success:true
                    });
                }
            });
                
        });

    apinotes.put('/delcomment/:id',middleware.requireLogin,function(req,res) {
        Comments.findByIdAndRemove(req.params.id,function (err) {
            if (!err) {
                notes.findById(req.body.id,function(err,notespdf) {
                    console.log("before comment deleted");
                    console.log(notespdf.comments);
                    notespdf.comments.splice(notespdf.comments.indexOf(req.params.id),1);
                    console.log(notespdf.comments);
                    notespdf.save(function (err) {
                        if(err)
                        {
                            res.send(err);
                            return;
                        }
                        else
                        {
                            res.json({
                                message:"successfully deleted comment",
                                success:true
                            });
                        }
                    });
                })
            }
        })
    });

    apinotes.put('/comments/:id',middleware.requireLogin,function(req,res) {
        comments=new Comments(req.body);
        comments.save(function(err,comment) {
            if (err) 
                console.log(err);
            else
            {
                notes.findById(req.params.id,function(err,notes) {
                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {
                        notes.comments.push(comment);
                        notes.save(function (err) {
                            if(!err)
                            {
                                res.json({
                                    comment:comment,
                                    message:"successfully commented book",
                                    success:true
                                }); 
                            }
                            else
                                console.log(err);
                        });
                    }
                });
                
            }
        });
    });

		

	return apinotes;
}