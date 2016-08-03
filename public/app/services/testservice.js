angular.module('testService',[])

.factory('Test',function($http) {
	var testFactory={};

	

	return testFactory;
})
.config(function($httpProvider) {
	$httpProvider.interceptors.push('ImageIntercepter');
})