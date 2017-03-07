var mongoose=require('mongoose');
var User=require('./user');
var Comments=require('./comments');
var Forumreplys=require('./forumreplys');
var Schema=mongoose.Schema;

var pdfSchema=new Schema(
{
	user: {type: Schema.ObjectId,ref: 'User'},
	username:String,
	occupation:String,
	displayname:String,
	timestamp:{type: String,required:true},
	tags:{type:String,required:true},
	likes:[{type: Schema.ObjectId,ref: 'User'}],
	dislikes:[{type: Schema.ObjectId,ref: 'User'}],
	comments:[{type: Schema.ObjectId,ref: 'Comments'}],
	description:String,
	level:Number,
	forumtopics:[{
				name:{type:String,required:true},
				reply:[{type: Schema.ObjectId,ref: 'Forumreplys'}],
				views:{type:Number}
				}]
});
var Pdf=mongoose.model('Pdf', pdfSchema);

module.exports=Pdf;