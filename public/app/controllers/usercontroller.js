angular.module('usercntrl',['userService','authService'])

.controller('usercontroller',function(Auth,Pdf,User,$location,$window,AuthToken) {
	var vm=this;
	vm.loggedIn=Auth.isLoggedIn();
	vm.loaduser=function(user) {
		if (user) {
			vm.user=user;
			console.log("going into mybooks");
			mybooks();
		} else {
			vm.user={};
		}
	}
	

	vm.signupuser=function() {
		vm.message='';
		
		User.createUser(vm.userData)
			.then(function(response) {
				vm.userData={};
				vm.message=response.data.message;
				console.log(response.data.message);
				if (response.data.success) {
					AuthToken.setToken(response.data.token);
					$location.path('/home');
				}
			});
	}

	

	var mybooks=function() {
			var i;
			vm.totlikes=vm.totdislikes=0;
			User.mybooks()
				.then(function(response) {
					
					vm.message=response.data.message;
					if(response.data.success)
					{
						vm.mybooks=response.data.data;
						for ( i = vm.mybooks.length - 1; i >= 0; i--) {
							vm.totlikes+=vm.mybooks[i].likes.length;
							vm.totdislikes+=vm.mybooks[i].dislikes.length;
						}
					}
					
					});
		}

	
	vm.like=function(x) {
			var selectedpdf=vm.mybooks[x];
			id=selectedpdf._id;
			Pdf.like(id)
				.then(function(response) {
					console.log('liking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.mybooks[x].likes.push(vm.user._id);
						console.log(vm.mybooks[x].likes);
						console.log(vm.message);
						}
						else
						{
							vm.mybooks[x].likes.splice(vm.mybooks[x].likes.indexOf(vm.user._id),1);
							console.log(vm.mybooks[x].likes);
							console.log(vm.message);
						}
					}
				})
			
		}
		vm.dislike=function(x) {
			var selectedpdf=vm.mybooks[x];
			id=selectedpdf._id;
			Pdf.dislike(id)
				.then(function(response) {
					console.log('disliking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.mybooks[x].dislikes.push(vm.user._id);
						console.log(vm.mybooks[x].dislikes);
						console.log(vm.message);
						}
						else
						{
							vm.mybooks[x].dislikes.splice(vm.mybooks[x].dislikes.indexOf(vm.user._id),1);
							console.log(vm.mybooks[x].dislikes);
							console.log(vm.message);
						}
					}
					})
		}
})

 