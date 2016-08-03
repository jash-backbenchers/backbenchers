var Contact=require('../models/contact');

var middleware=require('../middleware/middleware');

module.exports=function(app,express) {
	var apicontact=express.Router();

	apicontact.get('/contacts',middleware.requireLogin,function(req,res) {
		Contact.count({user:req.decoded._id},function(err,count) {
			if(err)
			{
				res.send(err);
				return;
			}
			res.json({contacts:count});
		});
	});	
	apicontact.post('/contact',middleware.requireLogin,function(req,res) {
		var contact=new Contact({
			user:req.decoded._id,
			name:req.body.name,
			email:req.body.email,
			number:req.body.number
		});
		contact.save(function(err,contact) {
			if(err)
			{
				if(err.code===11000)
				{
					res.json({message:'contact already exists'});
					return;
				}
				res.json(err);
			}
			
			res.json({message:'contact has been created',
					contact:contact,
					success:true
				});

		});
	});

	apicontact.get('/contact',middleware.requireLogin,function(req,res) {
		Contact.find({user:req.decoded._id},function(err,contacts) {
			if(err)
			{
				res.send(err);
				return;
			}
			res.json(contacts);
		});
	});	

	apicontact.get('/contact/:id',middleware.requireLogin,middleware.requireAuthorisation,function(req,res) {
		Contact.findById(req.params.id,function(err,contact) {
			if(err)
			{
				res.send(err);
				return;
			}
			res.json(contact);
		});
	});

	apicontact.put('/contact/:id',middleware.requireLogin,middleware.requireAuthorisation,function(req,res) {
		Contact.findByIdAndUpdate(req.params.id,req.body,function(err,contact) {
			console.log('updating usr');
			console.log(contact);
			if(err)
			{
				res.send(err);
				return;
			}
			else
			{
				res.json({
					message:"successfully updated",
					success:true
				});
			}
				
		});
	});	

	apicontact.delete('/contact/:id',middleware.requireLogin,middleware.requireAuthorisation,function(req,res) {
		Contact.findByIdAndRemove(req.params.id,function(err,contact) {
	
			if(err)
			{
				res.send(err);
				return;
			}
			else
			{
				res.json({
					message:"successfully deleted",
					success:true
				});
			}
				
		});
	});	

	return apicontact;
}