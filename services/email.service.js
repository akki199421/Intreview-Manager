var nodemailer = require('nodemailer');
var config = require('config.json');

var services = {};

services.sendEmail = function(email, content){
	console.log('send email');
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: config.email,
	    pass: config.email_pass
	  }
	});

	var mailOptions = {
	  from: config.email,
	  to: email,
	  subject: content.sub,
	  html: content.html
	};

	transporter.sendMail(mailOptions, function(error, info){});
}

module.exports = services;