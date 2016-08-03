var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var contactSchema=new Schema(
{
	user: {type: Schema.ObjectId,ref: 'User'},
	name:String,
	email:{type: String,required:true,unique:true},
	number:{type:String,required:true,unique:true}
});

var Contact=mongoose.model('Contact', contactSchema);

module.exports=Contact;