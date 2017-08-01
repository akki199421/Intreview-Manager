var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('config.json');


var userSchema = mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	hash: {type: String, required: true},
	email_conf : {type: Boolean, default: false},
	email_conf_hash : {type: String}
});

var User = mongoose.model('Users',userSchema);

module.exports = User;
module.exports.createUser = function(userPar, done){
	var error = {};
	User.findOne({'email':userPar.email}).exec(function(err, userRes){
		if(userRes){
			if(userRes.email === userPar.email){
				error.code = 11000;
				return done(error,null);
			}
		}
		//save
		var user = _.omit(userPar, 'password');
		user.hash = bcrypt.hashSync(userPar.password, 10);
		//create a hash to confirm email
		user.email_conf_hash = bcrypt.hashSync(userPar.email, 10);
		var newUser = new User(user);
		newUser.save(done);
	});	
}

module.exports.authenticate = function(userName, pass, done){
	var error = {};
	User.findOne({'email':userName}).exec(function(err, userRes){
		if(err){
			return done(err,null);
		}
		if(userRes){
			if(userRes.email_conf){
				if(bcrypt.compareSync(pass, userRes.hash)){
					return done(err, jwt.sign({ userId: userRes._id }, config.secret))
				}
				else{
					//password wrong
					error.msg = 'Password is incorret';
					return done(error, null);
				}
			}
			else{
				error.msg = 'Email not confirmed!!';
				return done(error, null);
			}
		}
		else{
			//email not found
			error.msg = 'Email not Found!!!';
			return done(error, null);
		}
		
	});
}

module.exports.verifyUserEmail = function(token, done){
	User.findOneAndUpdate({email_conf_hash: token}, 
		{
			$set:{ "email_conf": true},
			$unset:{"email_conf_hash": 1}
		}, 
		{
			new: true
		}, 
		function(err, userRes){
		if(err){
			return done(err, null);
		}
		if(userRes){
			//token found
			return done(null, userRes);
		}
	})
}

module.exports.getUser = function(headers, done){
	var decoded;
	if(headers && headers.authorization){
		//get token
		var token = headers.authorization.substring(7,headers.authorization.length);
		try{
			//verify token
			decoded = jwt.verify(token,config.secret);
		}
		catch(e){
			return done(401, null);
		}
	}
	User.findOne({_id: decoded.userId}).exec(function(err, userRes){
		if(userRes){
			return done(null, userRes);
		}
		return done(404, null);
	});
}

