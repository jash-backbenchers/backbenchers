angular.module('testcntrl',['testService','authService'])

.controller('testcontroller',function(Test) {
	var vm=this;
		Test.getImage()
			.then(function(response) {
				console.log(response.data);
				vm.img=response.data;
			})
	})


 