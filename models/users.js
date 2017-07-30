var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('config.json');


var userSchema = mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	hash: {type: String, required: true}
});

var User = mongoose.model('Users',userSchema);

module.exports = User;
module.exports.createUser = function(userPar, done){
	var error = {};
	console.log('Create User', userPar.email);
	User.findOne({'email':userPar.email}).exec(function(err, userRes){
		console.log('findOne', userRes);
		if(userRes){
			if(userRes.email === userPar.email){
				console.log('duplicate email');
				error.code = 11000;
				return done(error,null);
			}
		}
	});
	console.log('inside save');
	var user = _.omit(userPar, 'password');
	user.hash = bcrypt.hashSync(userPar.password, 10);
	var newUser = new User(user);
	newUser.save(done);
	// return done(error,null);
}

module.exports.authenticate = function(userName, pass, done){
	console.log('in authenticate', userName);
	var error = {};
	User.findOne({'email':userName}).exec(function(err, userRes){
		if(err){
			console.log('in authenticate err', err);
			return done(err,null);
		}
		if(userRes){
			if(bcrypt.compareSync(pass, userRes.hash)){
				console.log('in sync');
				return done(err, jwt.sign({ sub: userRes._id }, config.secret))
			}
			else{
				//email not found
				console.log('in authenticate err 403');
				error.code = 403;
				return done(error, null);
			}
		}
		else{
			console.log('email not found');
			error.code = 404;
			return done(error, null);
		}
		
	});
}