angular.module('maincntrl',[])

.controller('maincontroller',function($rootScope,$location,Auth,Pdf,User,$routeParams) {
	var vm=this;
	vm.user={};
	vm.reload=Date.now();

	var c=document.getElementById('c');
	vm.pdfurlprefex="public/web/viewer.html?file=http://localhost:4000/pdf/";
	vm.searchfilter='';
	vm.loggedIn=Auth.isLoggedIn();
	vm.standby=function(img) {
		console.log("setting");
		img.src="/img/user.png";
	}
	vm.checknload=function() {
		if (vm.user) {
			return;
		} else {
			vm.loaduser();
		}
	}
	vm.loaduser=function() {
		vm.loggedIn=Auth.isLoggedIn();
		console.log('logged in : '+vm.loggedIn);
		if (vm.loggedIn) {
		Auth.getUser()
			.then(function(data) {
				vm.user=data.data;
				console.log('loading user in loaduser');
				console.log(vm.user);
			});
		}
	else
		vm.user={};
	}
	vm.loaduser();
	var refresh=function() {
		Pdf.all()
		.success(function(data) {
			console.log("refreshing books");
			vm.pdflistx=data;
			vm.totalpdfs=vm.pdflistx.length;
			console.log(vm.pdflistx.notes);
		});

	}
	
	
	$rootScope.$on('$routeChangeStart',function(event,next,current) {
	console.log('changing');
	vm.loggedIn=Auth.isLoggedIn();
	vm.checknload();
	if(next.$$route.authenticated)
	{
		if (!vm.loggedIn)
			$location.path('/login');
	}
	if(next.$$route.originalPath == "/lib")
	{
		if (!vm.loggedIn)
			$location.path('/login');
		refresh();
	}
	if(next.$$route.originalPath == "/reloaduser")
	{
		if (!vm.loggedIn)
			$location.path('/login');
		else{
			vm.loaduser();
			vm.reload=Date.now();
			$location.path('/home');
		}
		
	}
	if(next.$$route.originalPath == "/home")
	{
		if (vm.loggedIn)
			vm.loaduser();
	}
	
	});

	vm.doLogin=function() {
		vm.processing=true;

		vm.error='';

		Auth.login(vm.loginData.username,vm.loginData.password)
			.success(function(data) {

				vm.processing=false;

				if (data.success) {
					vm.loaduser();
					$location.path('/home');
				}
				else
				{
					vm.loginData.password="";
					vm.message=data.message;
					console.log(vm.message);
				}
			});

	}

	vm.doLogout=function() {
		Auth.logout();
		vm.user={};
		$location.path('/logout');
	}

		vm.allocateLoc=function(x) {
			console.log("in allocation");
			console.log(x);
			vm.selectedpdf=vm.pdflist.notes[x];
			//console.log(vm.pdflist[0]);
			var file=vm.selectedpdf.displayname+'-'+vm.selectedpdf.timestamp+'.pdf';
			vm.pdfurl=vm.pdfurlprefex+file;
			console.log(vm.pdfurl);
		}
		vm.myallocateLoc=function(x,y,notes) {
			console.log("in my allocation");
			//console.log(vm.pdflist[0]);
			var file=x+'-'+y+'.pdf';
			vm.selectedpdf=notes;
			vm.pdfurl=vm.pdfurlprefex+file;
			console.log(vm.pdfurl);
		}
		vm.comment=function(comment) {
			console.log(vm.comment.data);
			var id=vm.selectedpdf._id;
			var commentdata={timestamp:Date.now(),comment:vm.comment.data,userid:vm.user._id,user:vm.user.username};
			Pdf.comment(id,commentdata)
				.then(function(response) {
					if(response.data.success)
					{
						vm.selectedpdf.comments.push(response.data.comment);
						vm.comment.data="";
						vm.adjustcheight();
					}
				})
			}
		vm.like=function(x) {
			vm.selectedpdf=vm.pdflist.notes[x];
			id=vm.selectedpdf._id;
			Pdf.like(id)
				.then(function(response) {
					console.log('liking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.pdflist.notes[x].likes.push(vm.user._id);
						console.log(vm.pdflist.notes[x].likes);
						console.log(vm.message);
						}
						else
						{
							vm.pdflist.notes[x].likes.splice(vm.pdflist.notes[x].likes.indexOf(vm.user._id),1);
							console.log(vm.pdflist.notes[x].likes);
							console.log(vm.message);
						}
					}
				})
			
		}
		vm.dislike=function(x) {
			 vm.selectedpdf=vm.pdflist.notes[x];
			id=vm.selectedpdf._id;
			Pdf.dislike(id)
				.then(function(response) {
					console.log('disliking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.pdflist.notes[x].dislikes.push(vm.user._id);
						console.log(vm.pdflist.notes[x].dislikes);
						console.log(vm.message);
						}
						else
						{
							vm.pdflist.notes[x].dislikes.splice(vm.pdflist.notes[x].dislikes.indexOf(vm.user._id),1);
							console.log(vm.pdflist.notes[x].dislikes);
							console.log(vm.message);
						}
					}
					})
		}
	vm.vlike=function(x) {
			 vm.selectedpdf=vm.getUserData[x];
			id=vm.selectedpdf._id;
			Pdf.like(id)
				.then(function(response) {
					console.log('liking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.getUserData[x].likes.push(vm.user._id);
						console.log(vm.getUserData[x].likes);
						console.log(vm.message);
						}
						else
						{
							vm.getUserData[x].likes.splice(vm.getUserData[x].likes.indexOf(vm.user._id),1);
							console.log(vm.getUserData[x].likes);
							console.log(vm.message);
						}
					}
				})
			
		}
		vm.vdislike=function(x) {
			 vm.selectedpdf=vm.getUserData[x];
			id=vm.selectedpdf._id;
			Pdf.dislike(id)
				.then(function(response) {
					console.log('disliking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.getUserData[x].dislikes.push(vm.user._id);
						console.log(vm.getUserData[x].dislikes);
						console.log(vm.message);
						}
						else
						{
							vm.getUserData[x].dislikes.splice(vm.getUserData[x].dislikes.indexOf(vm.user._id),1);
							console.log(vm.getUserData[x].dislikes);
							console.log(vm.message);
						}
					}
					})
		}
	
		vm.updatebag=function(x) {
			 vm.selectedpdf=vm.pdflist.notes[x];
			id=vm.selectedpdf._id;
			console.log(id);
			User.updateBag(id)
				.then(function(response) {
					console.log('updating bag');
					vm.message=response.data.message;
					if(response.data.success)
					{
						console.log(vm.message);
					}
					
					})

		}
		vm.mybooks=function() {
			
			User.mybooks()
				.then(function(response) {
					
					vm.message=response.data.message;
					if(response.data.success)
					{
						console.log(response.data.data);
					}
					
					})

		}

		vm.getUser=function(usernamex) {
		vm.message='';
		
		User.getUser(usernamex)
			.then(function(response) {
				vm.message=response.data.message;
				vm.vtotlikes=vm.vtotdislikes=0;
				vm.getUserData=response.data.data;
				vm.getUserUser=response.data.user;
				if(vm.getUserUser.picstamp)
					vm.vpic=true;
				else
					vm.vpic=false;
				for ( i = vm.getUserData.length - 1; i >= 0; i--) {
					vm.vtotlikes+=vm.getUserData[i].likes.length;
					vm.vtotdislikes+=vm.getUserData[i].dislikes.length;
				}
				console.log(vm.getUserData);

			});
	}

	vm.previewload=function() {
		if(vm.selectedpdf)
			vm.star();
		else
		{
			console.log($routeParams.id);
			Pdf.bookById($routeParams.id)
				.then(function(response) {
					console.log("in pdf get book by id");
					vm.selectedpdf=response.data.book;
					var file=vm.selectedpdf.displayname+'-'+vm.selectedpdf.timestamp+'.pdf';
					vm.pdfurl=vm.pdfurlprefex+file;
					vm.star();
				});
		}

	}
	vm.visituserload=function() {
		if(vm.getUserData&&vm.getUserUser)
			console.log("loading visituser.....");
		else
		{
			vm.getUser($routeParams.username)
		}

	}
	vm.delcomment=function(id,index) {
		console.log(id);
		notesid={id:vm.selectedpdf._id}
		Pdf.delcomment(id,notesid)
			.then(function(response) {
				if (response.data.success) {
					console.log("successfully deleted comment" + id);
					vm.selectedpdf.comments.splice(index,1);
					vm.adjustcheight();
				}
			})
	}

	vm.sidesearch=function(input) {
		vm.searchfilter=input;
	}

	vm.star=function() {
		var rating=2;
		var ratingfil=[
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"}
					];
		
		var likes=vm.selectedpdf.likes.length;
		var dislikes=vm.selectedpdf.dislikes.length;
		console.log(likes,dislikes);
		if(likes>dislikes*2)
			rating=3;
		else if(likes>dislikes*10)
			rating=4;
		else if(likes>dislikes*100)
			rating=5;
		console.log(rating);
		for (var i = 0; i < rating; i++) {
			ratingfil[i].class="glyphicon glyphicon glyphicon-star";
		}
		vm.ratingfil=ratingfil;
		
	}

	vm.adjustcheight=function() {
		var c=document.getElementById('c');
		c.scrollTop=c.scrollHeight;
		console.log("scrool height is"+c.scrollHeight);
	}
	
	vm.activelike=function(likes) {
		if(likes.indexOf(vm.user._id) == -1)
			return false;
		else
			return true;
	}

	vm.activedislike=function(dislikes) {
		if(dislikes.indexOf(vm.user._id) == -1)
			return false;
		else
			return true;
	}
	vm.addtopic=function() {
		console.log('working...');
		var topic={name:vm.newtopic};
		Pdf.addtopic(vm.selectedpdf._id,topic)
			.then(function(response) {
				if (response.data.success) {
					console.log("successfully deleted topic");
					vm.newtopic='';
					vm.selectedpdf.forumtopics.push(topic);
				}
			})
	}
	vm.addreply=function(reply,index) {
		console.log('working...');
		var reply={reply:reply,userid:vm.user._id,user:vm.user.username,index:index};
		Pdf.addreply(vm.selectedpdf._id,reply)
			.then(function(response) {
				if (response.data.success) {
					console.log("successfully replied to topic");
					console.log(reply);
					console.log(vm.selectedpdf.forumtopics[index]);
					if(vm.selectedpdf.forumtopics[index].reply)
						vm.selectedpdf.forumtopics[index].reply.push(reply);
					else
						$location.path('/lib');
					vm.newreply[index]='';
				}
			})
	}

})
.filter("star",function() {
	return function(input,likes,dislikes) {
		var rating=2;
		var ratingfil=[
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"},
						{class:"glyphicon glyphicon glyphicon-star-empty"}
					];
		//var likes=input.likes.length;
		//var dislikes=input.dislikes.length;
		if(likes>dislikes*2)
			rating=3;
		else if(likes>dislikes*10)
			rating=4;
		else if(likes>dislikes*100)
			rating=5;
		for (var i = 0; i <= rating; i++) {
			ratingfil[i].class="glyphicon glyphicon glyphicon-star";
		}
		console.log(ratingfil);
		return ratingfil;
	}

	
})
