angular.module('editcntrl', ['ngFileUpload', 'authService'])

.controller('editcontroller', function(Upload, $window, Auth, AuthToken, $location) {

    var vm = this;
    vm.uploadData={};
    vm.loaduserx = function(user) {
        vm.loggedIn = Auth.isLoggedIn();
        if (user) {
            vm.user = user;
            vm.uploadData.displayname = vm.user.name;
            //vm.uploadData.occupation = vm.user.occupation;
        } else
            vm.user = {};
        //console.log('in editcontroller');
        //console.log(vm.user);
    }

    vm.submit = function() { //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid

            vm.upload(vm.file); //call upload function
        }
    }

    vm.upload = function(file) {
        Upload.upload({
            url: '/api/edit/', //webAPI exposed to upload the file
            data: {
                user: vm.user._id,
                username: vm.user.username,
                name: vm.uploadData.displayname,
                //occupation: vm.uploadData.occupation,
                tags: vm.uploadData.tags
            },

            file: file

            //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                AuthToken.setToken(resp.data.token);
                $location.path('/reloaduser');
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
});
