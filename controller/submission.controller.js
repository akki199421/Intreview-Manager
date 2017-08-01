var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var mongoose = require('mongoose');
var multer = require('multer');
var expressValidator = require('express-validator');
var multiparty = require('multiparty');
var svgCaptcha = require("svg-captcha");
// var ipaddr = require('ipaddr.js');
var Q = require('q');
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
	console.log('profile');
	// console.log(config.dbUrl, mongoose.connection.readyState);
	req.session.captcha = 'fuck of';
	console.log('captcha',req.session);
	delete req.session.captcha;
	console.log('captcha',req.session);
	// if(req.session.page_views){
 //      req.session.page_views++;
 //      res.send("You visited this page " + req.session.page_views + " times");
 //   } else {
 //      req.session.page_views = 1;
      // res.send("Welcome to this page for the first time!");
   // }
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
	console.log('file is in', req.body.ip,req.session);

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
	      // An error occurred when uploading
	      console.log('The error is ' ,err);
	      //delete existing captcha
			// delete req.session.captcha;
			// //gen new captcha
			// var captcha = genCaptcha(req);
			// req.session.captcha = captcha.text;

			// values.error.push(err);
			var return_values = get_return_values(req);
			return_values.error = err;
			return res.render('profile-submission', return_values);
	    }
	    if(req.body.captcha !== req.session.captcha){
			//delete existing captcha
			// delete req.session.captcha;
			// //gen new captcha
			// var captcha = genCaptcha(req);
			// req.session.captcha = captcha.text;
			console.log("return values are", get_return_values(req));
			var return_values = get_return_values(req);
			return_values.error = 'Bad Captcha';
			return res.render('profile-submission', return_values);
		}
		console.log('file in ', req.file);

		//add file details
		req.body.cvOriginalName = req.file.originalname;
		req.body.cvSavedName = req.file.filename;
		req.body.ip = ip4;

		request({
			url: 'http://freegeoip.net/json/219.90.99.117',
			json: true
		}, function(error, response, body){
			if (error || response.statusCode !== 200){
				console.log('Error occurred while fetching location', error);
			}
			else if(response.statusCode === 200){
				req.body.location = body.region_name + ', '+ body.country_name+ ' Pin Code: '+ body.zip_code;
				console.log('location is', req.body.location, body);
			}
			profileModel.create(req.body,function(err, user){
				if(err){
					console.log(err);
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
				            console.log("Error uploading file.", err);
				        }
				        console.log("File is uploaded");
				    });
					return res.render('profile-submission', {
		            	success: 'Your profile has been submitted successfullly'
		        	});
					console.log(user.id);
				}
			});
		})
		//end of request

	    // req.body = request.body;
	    // req.body.cv = request.file;
	    // console.log('fil uploaded', req.body.cv);
	    // Everything went fine
	});
	console.log('fil uploaded', req.body);


	

	//get location from freegeoip.net

	// request({
	// 	url: 'http://freegeoip.net/json/219.90.99.117',
	// 	json: true
	// }, function(error, response, body){
	// 	if (error || response.statusCode !== 200){
	// 		console.log('Error occurred while fetching location', error);
	// 	}
	// 	else if(response.statusCode === 200){
	// 		req.body.location = body.region_name + ', '+ body.country_name+ ' Pin Code: '+ body.zip_code;
	// 		console.log('location is', req.body.location, body);
	// 	}
	// 	profileModel.create(req.body,function(err, user){
	// 		if(err){
	// 			console.log(err);
	// 			if(err.code  === 11000)
	// 				return res.render('profile-submission',{ error: 'A profile with email: ' + req.body.emails + ' already exists.'});
	// 			else
	// 				return res.render('profile-submission', { error: 'An error occurred', json: JSON.stringify(req.body.emails) });
	// 		}
	// 		else{	
	// 			upload(req,res,function(err) {
	// 		        if(err) {
	// 		            console.log("Error uploading file.", err);
	// 		        }
	// 		        console.log("File is uploaded");
	// 		    });
	// 			return res.render('profile-submission', {
	//             	success: 'Your profile has been submitted successfullly'
	//         	});
	// 			console.log(user.id);
	// 		}
	// 	});
	// })
	// console.log('request submitted', location_req);
	
	// console.log(form.body.body);
	// request.post({
	// 	url: config.apiUrl + '/candidate/submission',
 //        form: req.body
	// },function(error, response, body){
	// 	// console.log('ssdf', error,response);
	// 	if(error){
	// 		return res.render('profile-submission', { error: 'An error occurred' });
	// 	}
	// 	else if (response.statusCode !== 200){
	// 		return res.render('profile-submission', {
 //            	error: response.body
 //        	});
	// 	}
	// 	else{
	// 		upload(req,res,function(err) {
	// 	        if(err) {
	// 	            console.log("Error uploading file.", res);
	// 	        }
	// 	        console.log("File is uploaded");
	// 	    });
	// 		return res.render('profile-submission', {
 //            	success: 'Your profile has been submitted successfullly'
 //        	});
	// 	}
	// })

});

// router.get('/success', function(req, res){
// 	res.render('')
// })

module.exports = router;