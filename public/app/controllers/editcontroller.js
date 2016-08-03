
angular.module('editcntrl',['ngFileUpload','authService'])

.controller('editcontroller',function(Upload,$window,Auth,$location) {
  
var vm = this;  
vm.loggedIn=Auth.isLoggedIn();
    if (vm.loggedIn) {
        Auth.getUser()
            .then(function(data) {
                vm.user=data.data;
            });
        }
    else
        vm.user={};
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
    
    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/api/edit/', //webAPI exposed to upload the file
            data:{
                            user:vm.user._id,
                            username:vm.user.username,
                            displayname:vm.uploadData.displayname,
                            tags:vm.uploadData.tags},

            file:file

             //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
               $location.path('/lib');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
});