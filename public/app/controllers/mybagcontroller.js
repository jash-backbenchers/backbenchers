angular.module('mybagcntrl',[])

.controller('mybagcontroller',function($rootScope,$location,Auth,Pdf,User) {
	var vm=this;
	vm.pdfurlprefex="public/web/viewer.html?file=http://localhost:3000/pdf/";
	vm.searchfilter='';
	vm.loggedIn=Auth.isLoggedIn();
	vm.loaduser=function(user) {
		if (user)
			vm.user=user;
		else
			vm.user={};
	}
	
	var refresh=function() {
		//Pdf.all()
		//.success(function(data) {
		//	vm.pdflist=data;
		//	vm.totalpdfs=vm.pdflist.length;
		//	console.log(vm.pdflist);
		//});
		User.getBag()
				.then(function(response) {
					
					vm.message=response.data.message;
					if(response.data.success)
					{
						vm.pdflistx=response.data.data[0].mybag;
						vm.totalpdfs=vm.pdflistx.length;
						console.log(vm.pdflistx);
					}
					
					});

	}
	refresh();

	
		vm.like=function(x) {
			var selectedpdf=vm.pdflist[x];
			id=selectedpdf._id;
			Pdf.like(id)
				.then(function(response) {
					console.log('liking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.pdflist[x].likes.push(vm.user._id);
						console.log(vm.pdflist[x].likes);
						console.log(vm.message);
						}
						else
						{
							vm.pdflist[x].likes.splice(vm.pdflist[x].likes.indexOf(vm.user._id),1);
							console.log(vm.pdflist[x].likes);
							console.log(vm.message);
						}
					}
				})
			
		}
		vm.dislike=function(x) {
			var selectedpdf=vm.pdflist[x];
			id=selectedpdf._id;
			Pdf.dislike(id)
				.then(function(response) {
					console.log('disliking book');
					vm.message=response.data.message;
					if(response.data.success)
					{
						if(response.data.action)
						{	
						vm.pdflist[x].dislikes.push(vm.user._id);
						console.log(vm.pdflist[x].dislikes);
						console.log(vm.message);
						}
						else
						{
							vm.pdflist[x].dislikes.splice(vm.pdflist[x].dislikes.indexOf(vm.user._id),1);
							console.log(vm.pdflist[x].dislikes);
							console.log(vm.message);
						}
					}
					})
		}
		vm.delupdatebag=function(x) {
			var selectedpdf=vm.pdflist[x];
			id=selectedpdf._id;
			console.log(id+"_"+x);
			User.delupdateBag(id)
				.then(function(response) {
					console.log('deleting from bag');
					vm.message=response.data.message;
					if(response.data.success)
					{
						
						console.log(vm.pdflist);
						vm.pdflistx.splice(vm.pdflistx.indexOf(vm.pdflist[x]),1);
						vm.pdflist.splice(x,1);
						console.log(vm.pdflist);
					}
					
					})

		}
		vm.date=function (timestamp) {
			console.log(timestamp);
			var d=new Date(timestamp);
        	var temp=d.getMonth();
        	console.log(d);
        	return temp;
		}
		

})

