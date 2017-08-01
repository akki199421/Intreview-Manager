var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var mongoose = require('mongoose');
var multer = require('multer');
var svgCaptcha = require("svg-captcha");
// var ipaddr = require('ipaddr.js');
var fs = require('fs');
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir=path.join(__dirname, '../public/uploads/');
    return cb(null, dir);
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var profileModel = require('models/profiles');
var upload = multer({ 
					fileFilter: function (req, file, cb) {
						if(file.mimetype === 'application/pdf')
							return cb(null, true);
						cb("Error! Invalid file type. Please only upload pdfs");
						},
					storage: storage }).single('cv');

function genCaptcha(){
	return svgCaptcha.create({noise: 2, color: true, background: '#dd12ee'});
}

router.get('/', function(req, res){

	delete req.session.captcha;
   	var captcha = genCaptcha();
   	req.session.captcha = captcha.text;
	res.render('profile-submission', {captchaImg: captcha.data});
});

router.post('/', function(req, res, next){
	var file = req.file;
	var result = [];
   	res.dd = req.body;
   	var ip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   	var ip4 = ip.replace(/^.*:/, '');

	var get_return_values = function(req){
		delete req.session.captcha;
		//gen new captcha
		var captcha = genCaptcha(req);
		req.session.captcha = captcha.text;
		var values = {
			captchaImg: captcha.data,
			name: req.body.name,
			emails: req.body.emails,
			webAddress: req.body.webAddress,
			coverLetter: req.body.coverLetter
		}
		return values;
	}
	//check capctha
	
	upload(req, res, function (err) {
    	if (err) {
			var return_values = get_return_values(req);
			return_values.error = err;
			return res.render('profile-submission', return_values);
	    }
	    if(req.body.captcha !== req.session.captcha){
			var return_values = get_return_values(req);
			return_values.error = 'Bad Captcha';
			return res.render('profile-submission', return_values);
		}

		//add file details
		req.body.cvOriginalName = req.file.originalname;
		req.body.cvSavedName = req.file.filename;
		req.body.ip = ip4;

		request({
			url: 'http://freegeoip.net/json/'+ip4,
			json: true
		}, function(error, response, body){
			if (error || response.statusCode !== 200){
			}
			else if(response.statusCode === 200){
				req.body.location = body.region_name + ', '+ body.country_name+ ' Pin Code: '+ body.zip_code;
			}
			profileModel.create(req.body,function(err, user){
				if(err){
					delete req.session.captcha;
					var captcha = genCaptcha(req);
					req.session.captcha = captcha.text;
					if(err.code  === 11000){
						var return_values = get_return_values(req);
						return_values.error = 'A profile with email: ' + req.body.emails + ' already exists.';
						return res.render('profile-submission', return_values);
					}
					else
						return res.render('profile-submission', { 
							error: 'An error occurred', json: JSON.stringify(req.body.emails),
							captchaImg: captcha.data 
						});
				}
				else{	
					upload(req,res,function(err) {
				        if(err) {
				        }
				    });
					return res.render('profile-submission', {
		            	success: 'Your profile has been submitted successfullly'
		        	});
				}
			});
		})
		//end of request
	});

});

module.exports = router;