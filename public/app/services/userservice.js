angular.module('userService',[])

.factory('User',function($http) {
	var userFactory={};

	userFactory.createUser=function(userData) {
		return $http.post('/api/signup',userData);
	}

	userFactory.all=function(userData) {
		return $http.get('/api/users');
	}

	userFactory.updateBag=function(notes) {
		console.log('updating bag');
		console.log(notes);
		return $http.put('/api/notes/tomybag/'+notes);
	}

	userFactory.delupdateBag=function(notes) {
		console.log('deleting from bag');
		console.log(notes);
		return $http.put('/api/notes/todelmybag/'+notes);
	}

	userFactory.getUser=function(username) {
		console.log(username);
		return $http.get('/api/getUser/'+username);
	}

	userFactory.getBag=function() {
		return $http.get('/api/notes/tomybag1/');
	}

	userFactory.mybooks=function() {
		return $http.get('/api/notes/mybooks/');
	}
	return userFactory;
})