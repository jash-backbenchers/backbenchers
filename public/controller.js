

var app=angular.module("myapp",[]);
app.controller("controller",function ($scope,$http) {


var refresh = function() {
  $http.get('/contactlist').success(function(response) {
    console.log("I got the data I requested");
    console.log(response);
    $scope.contactlist = response;
    $scope.contact = "";
  });
};

refresh();

$scope.signin = function() {
  console.log($scope.user);
  $http.post('/api/signin', $scope.user).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.addContact = function() {
  console.log($scope.contact);
  $http.post('/contactlist', $scope.contact).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.edit = function(id) {
  console.log(id);
  $http.get('/contactlist/' + id).success(function(response) {
    console.log(response);
    $scope.contact = response;
  });
};

$scope.delete = function(id) {
  console.log(id);
  $http.delete('/contactlist/' + id).success(function(response) {
    console.log(response);
    $scope.contact = "";
    refresh();
  });
};

$scope.clear = function() {
  $scope.contact = "";
};

$scope.update = function() {
  var id=$scope.contact._id;
  var contact=$scope.contact;
  console.log(id);
  $http.put('/contactlist/' + id,contact).success(function(response) {
    console.log(response);
    //$scope.contact = response;
    contact="";
    refresh();
  });
};  

})