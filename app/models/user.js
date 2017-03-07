var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcryptjs');
var Pdf=require('./pdf');

var UserSchema=new Schema({
	name:String,
	email:String,
	username:{type:String,required:true,index:{unique:true}},
	password:{type:String,required:true,select:false},
	timestamp:{type:String},
	occupation:{type:String},
	picstamp:{type:Boolean},
	mybag:[{type: Schema.ObjectId,ref: 'Pdf'}]
});

UserSchema.pre('save',function(next) {
	var user=this;
	console.log('at pre');
	if(!user.isModified('password'))
		return next();

	var salt = bcrypt.genSaltSync(10);
 	var hash = bcrypt.hashSync(user.password, salt);
 	
 	user.password=hash;
	console.log(user.password);
	next();
	/*
	bcrypt.hash(user.password,null,null,function(err,hash) {
		if(err)
			return next();
		user.password=hash;
		next();
	});
	*/
});

UserSchema.methods.comparePasswords=function(password) {
	user=this;
	return bcrypt.compareSync(password,user.password);
};

module.exports=mongoose.model('User',UserSchema);