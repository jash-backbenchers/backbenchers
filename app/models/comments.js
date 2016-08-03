var mongoose=require('mongoose');
var User=require('./user');
var Schema=mongoose.Schema;

var commentsSchema=new Schema(
{
	timestamp:{type: String,required:true},
	comment:{type: String,required:true,unique:false},
	userid: {type: Schema.ObjectId,ref: 'User'},
	user: {type: String,required:true}
});

var Comments=mongoose.model('Comments', commentsSchema);
Comments.collection.dropIndex('comment');
module.exports=Comments;