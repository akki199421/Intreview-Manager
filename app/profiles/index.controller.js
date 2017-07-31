(function(){
	angular.module('profileMag')
	.controller('ProfileController', function($scope, ProfileService, UserService){
		var pc = this;
		var _currentUser;
		pc.init = function(){
			_currentUser = UserService.getCurrentUser();
			console.log('sfsdf controller', UserService.getCurrentUser());	
			ProfileService.getAllProfile()
			.then(function(data){
				console.log('Success fetchAll',data);
				pc.profiles = data.map(function(profile){
					_currentUser = UserService.getCurrentUser();
					user_id = _currentUser._id;
					console.log('user id', user_id);
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
					console.log('profiles', profile.comments);
					console.log('current',(profile.current_review.techRatings && profile.current_review.communRatings) === undefined);
					return profile;
				});
			},function(error){
				console.log('error fetch All', error);
			});
			// pc.techRatings = 0;
			// pc.communRatings = 0;
			pc.comments = [{
				name: 'Akshay',
				content: 'Hello A**holes'
			},{
				name: 'Prateek',
				content: "asss"
			}];
		}
		pc.saveNewComment = function(index,resComment){
			console.log(resComment.content);
			var newComment = {
				comment : resComment.content,
				user_id: _currentUser._id,
				user_name: _currentUser.name,
				profile_id: pc.profiles[index]._id
			}
			console.log('new Comment', index,newComment);

			ProfileService.updateComment(newComment)
			.then(function(data){
				if(data === 'done'){
					pc.profiles[index].comments.push(newComment);
				}
			}, function(err){

			});
		}
		pc.rateFunction = function(index,rating){
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
				console.log('ready profile',pc.profiles[index]);

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
		pc.init();
	}).component('commentComponent',{
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
		console.log('comments', cm.existComments)
		cm.addNewComment = function(){
			cm.onSave({newComment : cm.newCm});
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
			console.log('RatingsController', vm.onSelect, vm.seleRating);
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
			console.log(typeof index);
			if(vm.readonly === false){
				vm.stars = _mapStart(index);
				vm.seleRating = index + 1;
				vm.onSelect({rating: index+1});
			}
			console.log('Hello',vm.stars);
		}
		vm.saveRating = function(){
			console.log('ins save', vm.techrating);
		}
		vm.init();
	})
})();