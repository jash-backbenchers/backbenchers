var mongoose=require('mongoose');
var User=require('./user');
var Comments=require('./comments');
var Schema=mongoose.Schema;

var pdfSchema=new Schema(
{
	user: {type: Schema.ObjectId,ref: 'User'},
	username:String,
	displayname:String,
	timestamp:{type: String,required:true},
	date:{type: String,required:true},
	tags:{type:String,required:true},
	likes:[{type: Schema.ObjectId,ref: 'User'}],
	dislikes:[{type: Schema.ObjectId,ref: 'User'}],
	comments:[{type: Schema.ObjectId,ref: 'Comments'}]
});
var Pdf=mongoose.model('Pdf', pdfSchema);

module.exports=Pdf;