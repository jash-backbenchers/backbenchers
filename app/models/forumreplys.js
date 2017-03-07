var mongoose=require('mongoose');
var User=require('./user');
var Schema=mongoose.Schema;

var forumreplysSchema=new Schema(
{
	timestamp:{type: String,required:true},
	reply:{type: String,required:true,unique:false},
	userid: {type: Schema.ObjectId,ref: 'User'},
	user: {type: String,required:true}
});

var Forumreplys=mongoose.model('Forumreplys', forumreplysSchema);
Forumreplys.collection.dropIndex('reply');
module.exports=Forumreplys;