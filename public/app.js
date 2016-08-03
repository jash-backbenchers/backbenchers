angular.module('myapp',['ngAnimate','maincntrl','editcntrl','usercntrl','contactcntrl','testcntrl','libcntrl','uploadcntrl','mybagcntrl',
				'appRoutes','contactService','authService','userService','testService',
				'socketService','pdfService','socketcntrl'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthIntercepter');
})

