'use strict';


//Post Index Controller
angular.module('Yote')

  // default resource controller generated by the CLI
  .controller('PostCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log('PostCtrl loaded...');
  }])

  /********************** 
  *  Custom Controllers 
  ***********************/

  .controller('PostListCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log('post list ctrl');
    // $scope.data = {};
    PostFactory.all()
      .then(function(data) {
        $scope.posts = data;
      }, function(data){
        alert(data);
      });
    console.log($scope.posts);
  }])

  .controller('PostShowCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log("post show ctrl");

    //next call breaks second time it is called, regardless. why?
    var postId = $stateParams.postId;
    console.log(postId);

    PostFactory.show(postId)
      .then(function(data){
        $scope.post = data;
      }, function(data){
        alert(data);
      });


  }])

// end of file
;