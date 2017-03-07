

angular.module('socketcntrl',['socketService','authService'])

.controller('socketcontroller',function($scope,Socket,$rootScope,$location,$window,Auth,AuthToken,$scope) {
	var scon=this;
	scon.user={};
	scon.users=[];
	scon.messages=[];
	scon.loaduserx=function(user) {
		console.log('in loadx');
		
		scon.user=user;
		scon.userx=user;

		if (Auth.isLoggedIn) {
		if(scon.user) {
				
				Socket.emit('connection');
				console.log('connecting');
				console.log(scon.user.username);
				Socket.emit('add-user',{'user':scon.user.username});
				Socket.emit('users',{});

				Socket.on('update-adduserlist',function(data) {
					console.log('from adduserlist'+data);
					scon.users.push(data);
					console.log(scon.users);
				});

				Socket.on('update-deluserlist',function(data) {
					//console.log("before deleting total usrs are..."+scon.users)
					console.log(data);
					console.log('deleting user'+data.username);
					scon.users.splice(scon.users.indexOf(data.username),1);
					console.log("after deleting total usrs are..."+scon.users)
				});

				scon.msg=function() {
			  		console.log('messaging');
			  		if (scon.messageData != null) {
			  			Socket.emit('message',{message:scon.messageData,'user':scon.user.username});
			  			scon.messageData='';
			  		}
			  		
			  	}

			  	scon.adjustmheight=function() {
			  		var m=document.getElementById('messagesec');
					m.scrollTop=m.scrollHeight;
					console.log("adjustmgeight");

			  	}

				Socket.on('users',function(data) {
					console.log(data);
					scon.users=data;
				})

				Socket.on('message',function(data) {
					scon.messages.push(data);
					scon.adjustmheight();
				})
			};
		}
	}

})
