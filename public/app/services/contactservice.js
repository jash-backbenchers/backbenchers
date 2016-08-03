angular.module('contactService',[])

.factory('Contact',function($http) {
	var contactFactory={};

	contactFactory.createContact=function(contactData) {
		return $http.post('/api/contacts/contact',contactData);
	}

	contactFactory.all=function() {
		return $http.get('/api/contacts/contact');
	}

	contactFactory.updateContact=function(id,contact) {
		console.log('updating');
		console.log(contact);
		return $http.put('/api/contacts/contact/'+id,contact);
	}

	contactFactory.getContact=function(id) {
		return $http.get('/api/contacts/contact/'+id);
	}

	contactFactory.deleteContact=function(id) {
		return $http.delete('/api/contacts/contact/'+id);
	}



	return contactFactory;
})