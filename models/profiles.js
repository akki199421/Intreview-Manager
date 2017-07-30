var mongoose = require('mongoose');


var profileSchema = mongoose.Schema({
	name: {type: String, required: true},
	emails: {type: String, required: true, index: { unique: true }},
	webAddress: {type: String},
	coverLetter: {type: String},
	workingQs: {type: String, required: true},
	ip6: {type: String},
	location: {type: String},
	timestamp: {type: Date, default: Date.now},
	comments: [{
		comment: String,
		user_id: mongoose.Schema.Types.ObjectId
	}],
	reviews: [{
		rating: Number,
		user_id: mongoose.Schema.Types.ObjectId
	}]
});

var Profile = mongoose.model('Candidates', profileSchema);

module.exports = Profile;

module.exports.create = function(profile,done){
	// console.log('inside create with pre', profile);
	profileSchema.pre('save', function(next) {
	    var self = this;
	    console.log('inside pre');
	    Profile.findOne({emails : this.emails}, 'emails', function(err, results) {
	        if(err) {
	            next(err);
	        } else if(results) {
	            console.warn('results', results);
	            self.invalidate("emails", "email must be unique");
	            next(new Error("email must be unique"));
	        }
	    });
	});
	var newProfile = new Profile(profile);
	newProfile.save(done);
	
}
