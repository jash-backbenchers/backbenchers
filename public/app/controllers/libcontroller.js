angular.module('libcntrl',[])

.controller('libcontroller',function(Auth,Pdf) {
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
	if (Auth.isLoggedIn())
		refresh();
		vm.allocateLoc=function(x) {
			console.log(x);
			var selectedpdf=vm.pdflist.notes[x];
			//console.log(vm.pdflist[0]);
			var file=selectedpdf.displayname+'-'+selectedpdf.timestamp+'.pdf';
			vm.pdfurl=vm.pdfurlprefex+file;
			console.log(vm.pdfurl);
		}
		vm.like=function(x) {
			vm.pdflist.notes[x].likes+=1;
			
		}
		
	})


 