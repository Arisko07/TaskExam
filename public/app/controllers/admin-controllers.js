'use strict';

/* ADMIN CONTROLLER */

angular.module('Yote')

  // default resource controller generated by the CLI
  .controller('AdminCtrl', ['$scope', '$stateParams', '$state', 'UserFactory', 'PostFactory', function($scope, $stateParams, $state, UserFactory, PostFactory){
    console.log("AdminCtrl loaded...");
    UserFactory.list()
      .then(function(data) {
        $scope.users = data;
      }, function(data){
        alert(data);
      });
  }])

  /********************** 
  *  Custom Controllers 
  ***********************/

// end of file
;