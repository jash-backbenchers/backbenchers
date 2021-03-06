angular.module('pdfService',[])

.factory('Pdf',function($http) {
	var pdfFactory={};

	pdfFactory.like=function(notes) {
		return $http.put('/api/notes/like/'+notes);
	}
	pdfFactory.comment=function(id,comment) {
		return $http.put('/api/notes/comments/'+id,comment);
	}
	pdfFactory.addtopic=function(id,topic) { 
		return $http.put('/api/notes/addtopic/'+id,topic);
	}
	pdfFactory.addreply=function(id,reply) { 
		return $http.put('/api/notes/addreply/'+id,reply);
	}
	pdfFactory.dislike=function(notes) {
		return $http.put('/api/notes/dislike/'+notes);
	}
	pdfFactory.delcomment=function(id,notesid) {
		console.log(notesid);
		return $http.put('/api/notes/delcomment/'+id,notesid);
	}
	pdfFactory.all=function() {
		return $http.get('/api/notes/all');
	}
	pdfFactory.bookById=function(id) {
		return $http.get('/api/notes/bookById/'+id);
	}
	



	return pdfFactory;
})