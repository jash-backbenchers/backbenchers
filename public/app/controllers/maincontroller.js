angular.module('maincntrl',[])

.controller('maincontroller',function($rootScope,$location,Auth,Pdf,User,$routeParams) {
	var vm=this;
	vm.pdfurlprefex="public/web/viewer.html?file=http://localhost:3000/pdf/";

	vm.loggedIn=Auth.isLoggedIn();
	var refresh=function() {
		Pdf.all()
		.success(function(data) {
			vm.pdflist=data;
			vm.totalpdfs=vm.pdflist.length;
			console.log(vm.pdflist.notes);
		});

	}
	
	
	$rootScope.$on('$routeChangeStart',function(event,next,current) {
	console.log('changing');
	vm.loggedIn=Auth.isLoggedIn();
	if (vm.loggedIn) {
		Auth.getUser()
			.then(function(data) {
				vm.user=data.data;
				if(vm.user.picstamp)
					vm.pic=true;
				else
					vm.pic=false;
				//myrefresh();
			});
		}
	else
		vm.user={};

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
	
	});

	vm.doLogin=function() {
		vm.processing=true;

		vm.error='';

		Auth.login(vm.loginData.username,vm.loginData.password)
			.success(function(data) {

				vm.processing=false;

				if (data.success) {
					
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
		$location.path('/logout');
	}

		vm.allocateLoc=function(x) {
			console.log(x);
			vm.selectedpdf=vm.pdflist.notes[x];
			//console.log(vm.pdflist[0]);
			var file=vm.selectedpdf.displayname+'-'+vm.selectedpdf.timestamp+'.pdf';
			vm.pdfurl=vm.pdfurlprefex+file;
			console.log(vm.pdfurl);
		}
		vm.myallocateLoc=function(x,y) {
			
			//console.log(vm.pdflist[0]);
			var file=x+'-'+y+'.pdf';
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
			console.log("loading.....");
		else
		{
			console.log($routeParams.id);
			Pdf.bookById($routeParams.id)
				.then(function(response) {
					console.log("in pdf get book by id");
					vm.selectedpdf=response.data.book;
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
				}
			})
	}

		
});
