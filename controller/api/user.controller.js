var express = require('express');
var router = express.Router();
var config = require('config.json');
var userModel = require('models/users');
var emailService = require('services/email.service');

router.post('/register', registerUser);

router.post('/authenticate', authenticateUser);

router.post('/current', fetchCurrentUser);

router.get('/verify', confirmEmail);

function confirmEmail(req, res){
	userModel.verifyUserEmail(req.query.token, function(err, user){
		if(err){
			res.send('An error occured');
		}
		else{
			res.status(200).send('Your email '+ user.email+ ' was verified successfully');
		}
	})
}

function registerUser(req, res){
	userModel.createUser(req.body, function(err, user){
		if(err){
			if(err.code  === 11000)
			res.status(401).send('A user with email: ' + req.body.email + ' already exists.');
		}
		else{
			//create email subject
			var email_content = {};
			email_content.sub = "Confirmation Email from Interview Manager";
			email_content.html = "<p>Hello " + user.name +'</p><p>Click <a href="http://localhost:3001/api/user/verify?token=' + user.email_conf_hash + '" target="_blank">here</a> to verify your email</p>'
			//send email
			console.log(email_content.html);
			emailService.sendEmail(user.email,email_content);
			res.status(200).send('done');
		}
	});
}



function authenticateUser(req, res){
	userModel.authenticate(req.body.email, req.body.password, function(err, token){
		if(err){
			return res.status(401).send(err.msg);
			
		}
		return res.status(200).send({token:token});
	})
}

function fetchCurrentUser(req, res){
	userModel.getUser(req.headers, function(err, user){
		if(err){
			res.status(401).send(err);
		}
		res.status(200).send(user);
	})
}

module.exports = router;