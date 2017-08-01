(function(){
	angular.module('profileMag')
	.controller('ProfileController', function($scope,$uibModal, ProfileService, UserService){
		var pc = this;
		var _currentUser;
		pc.init = function(){
			pc.openedPdf = -1;
			UserService.getCurrentUser().then(function(data){
				_currentUser = data;
				ProfileService.getAllProfile()
				.then(function(data){
					//check if the current user has already given a review and add it to current_review
					//if not then add an empty object in current_review
					pc.profiles = data.map(function(profile){
						user_id = _currentUser._id;
						profile.current_review = {};
						profile.successMsg = false;
						for(var i = 0; i<profile.reviews.length;i++){
							if(profile.reviews[i].user_id === user_id){
								{
									profile.current_review = profile.reviews[i];
									profile.saveBtnDisable = true;
								}
							}
						}
						return profile;
					});
				},function(error){
					alert('Error fetching profiles');
				});
			}, function(err){
				alert('Error fetching User');
			});
		}
		pc.saveNewComment = function(index,resComment){
			var newComment = {
				comment : resComment.content,
				user_id: _currentUser._id,
				user_name: _currentUser.name,
				profile_id: pc.profiles[index]._id
			}
			ProfileService.updateComment(newComment)
			.then(function(data){
				if(data === 'done'){
					pc.profiles[index].comments.push(newComment);
				}
			}, function(err){

			});
		}
		pc.saveRatings = function(index){
			if(pc.profiles[index].current_review.techRatings === undefined ||
				pc.profiles[index].current_review.communRatings === undefined){
				alert('Please Enter Both Values');
			}
			else{
				var user_id =  _currentUser._id;
				//push current review into reviews
				pc.profiles[index].reviews.push({
					techRatings: pc.profiles[index].current_review.techRatings,
					communRatings: pc.profiles[index].current_review.communRatings,
					user_id
				});

				pc.profiles[index].current_review.user_id = user_id;

				ProfileService.updateReview(pc.profiles[index])
				.then(function(data){
					if(data === 'done'){
						pc.profiles[index].saveBtnDisable = true;
						pc.profiles[index].successMsg = true;
					}
				},function(err){
					alert('error saving data');
				});
			}
		}

		pc.openPdf = function(index){
			var fileSavedName = pc.profiles[index].cvSavedName;
			var fileOriginalName = pc.profiles[index].cvOriginalName;
			var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'fileModal.html',
		      windowClass: 'pdf-modal-window',
		      controller: function($scope){
		      	$scope.pdfUrl = '../uploads/'+fileSavedName;
		      	$scope.heading = fileOriginalName;
		      },
		      resolve: {
		      	fileSavedName: function(){
		      		return fileSavedName;
		      	},
		      	fileOriginalName: function(){
		      		return fileOriginalName;
		      	}
		      }
		      });
		}
		pc.init();
	})
	.component('commentComponent',{
		templateUrl: 'profiles/comment-template.html',
		controller: 'CommentsController',
		controllerAs: 'cm',
		bindings: {
			existComments: '=ngModel',
			onSave: '&?'
		}
	})
	.controller('CommentsController', function(ProfileService){
		var cm = this;
		cm.newCm = {};
		cm.addNewComment = function(){
			cm.onSave({newComment : cm.newCm});
			//remove current comment content
			cm.newCm = {};
		}

	})
	.component('reviewComponent',{
		templateUrl: 'profiles/review-template.html',
		controller: 'RatingsController',
		controllerAs: 'vm',
		bindings: {
			seleRating: '=?ngModel',
			onSelect: '&?'
		}
		
	}).controller('RatingsController', function($scope, ProfileService){
		var vm = this;
		vm.stars = [];
		var num = [0,1,2,3,4];
		vm.init = function(){
			vm.readonly = false;
			//no existing revies
			if(vm.seleRating === undefined){
				vm.stars = _mapStart(-1);
			}
			else{
				vm.stars = _mapStart(vm.seleRating-1);
				vm.readonly = true;
			}
		}

		var _mapStart = function(index){
			return num.map(function(a){
				if(a <= index)
					return {filled: true};
				else
					return {filled: false};
			})
		} 

		vm.toggle = function(index){
			if(vm.readonly === false){
				vm.stars = _mapStart(index);
				vm.seleRating = index + 1;
				vm.onSelect({rating: index+1});
			}
		}
		vm.saveRating = function(){
		}
		vm.init();
	})
})();