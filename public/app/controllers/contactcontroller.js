angular.module('contactcntrl',['contactService','userService','authService'])

.controller('contactcontroller',function(Contact,User,$location,$window,Auth,AuthToken) {
	var vm=this;
	vm.contactData={};
	vm.contactlist=[];
	vm.selectIndex='';
	var refresh=function() {
		Contact.all()
		.success(function(data) {
			vm.contactlist=data;
			vm.totalcontlen=vm.contactlist.length;
		});

	}
	if (Auth.isLoggedIn())
		refresh();

	vm.addContact=function() {
		vm.message='';
		
		Contact.createContact(vm.contactData)
			.then(function(response) {
				vm.message=response.data.message;
				if(response.data.success)
					vm.contactlist.push(response.data.contact);
				vm.contactData={};
			})
	}

	vm.delete=function(id,index) {
		vm.message='';
		console.log('deleting usr');
		console.log(id);
		Contact.deleteContact(id)
			.then(function(response) {
				vm.message=response.data.message;
				if(response.data.success)
					vm.contactlist.splice(index,1);		
			})
	}

	vm.edit=function(id,index) {
		vm.message='';
		console.log('editing user');
		console.log(id);
		Contact.getContact(id)
			.then(function(response) {
				
				if(response.data)
					vm.contactData=response.data;	
			})
		vm.selectIndex=index;
		
	}	


	vm.update=function() {
		Contact.updateContact(vm.contactData._id,vm.contactData)
			.then(function(response) {
				console.log('updating user');
				console.log(vm.contactData);
				vm.message=response.data.message;
				if(response.data.success)
				{
					vm.contactlist[vm.selectIndex]=vm.contactData;
					vm.clear();
				}
				
				})

	}


	vm.clear=function() {
		vm.contactData={};
	}


})

 