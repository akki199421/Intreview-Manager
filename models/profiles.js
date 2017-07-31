var mongoose = require('mongoose');

var commentsSchema = mongoose.Schema({
	comment: String,
	user_id: mongoose.Schema.Types.ObjectId,
	user_name: String
});

var reviewSchema = mongoose.Schema({
	techRatings: Number,
	communRatings: Number,
	user_id: mongoose.Schema.Types.ObjectId
});


var profileSchema = mongoose.Schema({
	name: {type: String, required: true},
	emails: {type: String, required: true, index: { unique: true }},
	webAddress: {type: String},
	coverLetter: {type: String},
	workingQs: {type: String, required: true},
	ip: {type: String},
	location: {type: String},
	timestamp: {type: Date, default: Date.now},
	comments: [commentsSchema],
	reviews: [reviewSchema]
});


profileSchema.pre('save', function(next) {
    var self = this;
    console.log('inside pre');
    // if (!this.reviews || this.reviews.length == 0) {
    // 	this.reviews = [];
    // 	this.reviews.push({
    // 		"techRatings": 0,
    		
    // 	})
    // }

    // Profile.findOne({emails : this.emails}, 'emails', function(err, results) {
    //     if(err) {
    //         next(err);
    //     } else if(results) {
    //         console.warn('results', results);
    //         self.invalidate("emails", "email must be unique");
    //         next(new Error("email must be unique"));
    //     }
    // });
    next();
});
// ,
// 	comments: [{
// 		comment: String,
// 		user_id: mongoose.Schema.Types.ObjectId,
// 		user_name: String
// 	}],
// 	reviews: [{
// 		techRatings: {type: Number, default: 0},
// 		communRatings: {type: Number, default: 0},
// 		user_id: mongoose.Schema.Types.ObjectId
// 	}]

var Profile = mongoose.model('Candidates', profileSchema);

module.exports = Profile;

module.exports.create = function(profile, callback){
	console.log('inside create with pre', profile);
	var newProfile = new Profile(profile);
	newProfile.save(callback);	
}


module.exports.fetchAll = function(done){
	Profile.find({}, function(err, res){
		if(err)
			return done(err, null);
		return done(null, res);
	})
}

module.exports.updateRew = function(profile,done){
	console.log('update',profile.current_review);

	Profile.findByIdAndUpdate({_id: profile._id},
		{$addToSet: 
			{ "reviews" : 
				{ "techRatings" : profile.current_review.techRatings , 
				  "communRatings": profile.current_review.communRatings,
				  "user_id": profile.current_review.user_id
				}
			}
		},function(err, res){
			if(err)
				return done(err);
			return done(null);
		}
	);
}

module.exports.updateCom = function(newComment, done){
	console.log('update comment',newComment);
	Profile.findByIdAndUpdate({_id: newComment.profile_id},
		{$addToSet: 
			{ "comments" : 
				{ "comment" : newComment.comment, 
				  "user_name": newComment.user_name,
				  "user_id": newComment.user_id
				}
			}
		},function(err, res){
			if(err)
				return done(err);
			return done(null);
		}
	);
}