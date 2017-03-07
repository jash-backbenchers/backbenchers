angular.module('testService',[])

.factory('Test',function($http) {
	var testFactory={};

	testFactory.getImage=function() {
		return $http.get('http://localhost:3000/pdf/a.jpg');
	}

	return testFactory;
})
.config(function($httpProvider) {
	$httpProvider.interceptors.push('ImageIntercepter');
})