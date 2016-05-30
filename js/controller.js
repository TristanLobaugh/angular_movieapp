var movieApp = angular.module("movieApp", []);

movieApp.controller("movieController", function($scope, $http, $q){
	$scope.multipleMatches = false;
	$scope.perfectMatch = false;
	var matchArray = [];


	var movieURL = "https://api.themoviedb.org/3/search/multi?api_key=e9ddb24aed6d48c4342303aba5269e28&query="; 


	$("#search-text").keyup(function(){
		var matchArray = [];
		searchFor = $scope.searchText;
		if(searchFor.length>2){
			$http({
				method: "GET",
				url: movieURL + searchFor
			}).then(function(movieData){
				// console.log(movieData.data.results);
				$scope.movieData = movieData.data.results;
			},function(movieData){
				console.log("There was an error")
			});
			setTimeout(function(){
				for(var i = 0; i < $scope.movieData.length; i++){
					if($scope.movieData[i].media_type === "tv"){
						if($scope.movieData[i].name === searchFor){
							matchArray.push({
											name: searchFor,
											media: "TV",
											dataObj: $scope.movieData[i]
											});
						}
					}else if($scope.movieData[i].media_type === "movie"){
						if($scope.movieData[i].title === searchFor){
							matchArray.push({
											name: searchFor,
											media: "Movies",
											dataObj: $scope.movieData[i]
											});
						}
					}else if($scope.movieData[i].media_type === "person"){
						if($scope.movieData[i].name === searchFor){
							matchArray.push({
											name: searchFor,
											media: "Actor/Actress",
											dataObj: $scope.movieData[i]
											});
						}
					}
				}
				if(matchArray.length > 1){
					$scope.$apply(function(){
						$scope.perfectMatch = false;
						$("#search-text").removeClass("perfect-match");
						$scope.multipleMatches = true;
						$scope.matches = matchArray;
					});
				}else if(matchArray.length > 0){
					$scope.multipleMatches = false;
					$scope.perfectMatch = true;
					$scope.singleMatch = matchArray[0];
					$("#search-text").addClass("perfect-match");
				}else{
					$("#search-text").removeClass("perfect-match");
					$scope.multipleMatches = false;
					$scope.perfectMatch = false;
				}
			}, 100);
		}
	});


    $scope.showModal = false;
    $scope.toggleModal = function(loc, data){
    	if((loc == 1 && $scope.perfectMatch == true) || (loc == 2 && $scope.multipleMatches == true)){
    		$scope.head = data.name;
    		$scope.posterPath = "http://image.tmdb.org/t/p/w300" + data.dataObj.poster_path;
    		$scope.description = data.dataObj.overview;
        	$scope.showModal = !$scope.showModal;
    	}else if(loc == 3){
    		$scope.showModal = !$scope.showModal;
    	}
    };

// END CONTROLLER
});

movieApp.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });


