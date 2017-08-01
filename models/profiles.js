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
	webAddress: {type: String ,required: true},
	coverLetter: {type: String},
	cvOriginalName: {type: String, required: true},
	cvSavedName: {type:String, required: true},
	workingQs: {type: String, required: true},
	ip: {type: String},
	location: {type: String},
	timestamp: {type: Date, default: Date.now},
	comments: [commentsSchema],
	reviews: [reviewSchema]
});

var Profile = mongoose.model('Candidates', profileSchema);

module.exports = Profile;

module.exports.create = function(profile, callback){
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