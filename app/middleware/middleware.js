var jwt=require('jsonwebtoken');
var config=require('../../config');
var secreteKey=config.secreteKey;
var Contact=require('../models/contact');
var multiparty = require('connect-multiparty');

module.exports.createToken =function(user) {
	var token=jwt.sign({
		_id:user._id,
		name:user.name,
		username:user.username,
		picstamp:user.picstamp,
		timestamp:user.timestamp
	},secreteKey,{expiresIn:'10h'});
	
	return token;
}





module.exports.requireLogin = function(req, res, next) {
	var token=req.body.token || req.params.token || req.headers['x-access-token']
	if(token)
	{
		jwt.verify(token,secreteKey,function(err,decoded) {
			if(err)
			{
				res.status(403).send({success:false,message:"unable to authenticate "});
			}
			else
			{
				req.decoded=decoded;
				next();
			}
		})
	}
	else
	{
		res.status(403).send({success:false,message:"no token provided "});
	}
 }

module.exports.requireAuthorisation=function(req,res,next) {
	Contact.findById(req.params.id,function(err,user) {
		if(err)
			res.status(404).send({success:false,message:"not found"});
		else
		{
			console.log(user);
			if(req.decoded._id == user.user)
				next();
			else
				res.status(403).send({success:false,message:"access denied"})
		}
	})
	
}