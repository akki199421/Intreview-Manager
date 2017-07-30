var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var mongoose = require('mongoose');
var multer = require('multer');
var expressValidator = require('express-validator');
var multiparty = require('multiparty');
// var ipaddr = require('ipaddr.js');


var fs = require('fs');
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir=path.join(__dirname, '../uploads/');
        console.log("Hello people in storage" , dir);

    return cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var profileModel = require('models/profiles');
var upload = multer({ storage: storage }).single('file');

router.get('/', function(req, res){
	console.log('profile');
	// console.log(config.dbUrl, mongoose.connection.readyState);
	res.render('profile-submission');
});

router.post('/', function(req, res, next){
	var file = req.file;
	var result = [];
   	res.dd = req.body;
   	req.body.ip6 = req.ip;
   	req.body.comments = [];
console.log('file is in', req.body)
   	// req.body.comments.push({
   	// 	comment: 'Hello',
   	// 	user_id:  mongoose.Schema.ObjectId("597d8c400b5e7e1294609588")
   	// })
 //   	try{
 //   		var addr = ipaddr.parse(req.ip);
	// 	req.body.ip4 = addr.toByteArray().toString(); 
	// }
	// catch(err){
	// 	console.log('Error in ip conversion')
	// }
	console.log('request submitted', req.body);
	
	profileModel.create(req.body,function(err, user){
		if(err){
			console.log(err);
			if(err.code  === 11000)
				return res.render('profile-submission',{ error: 'A profile with email: ' + req.body.emails + ' already exists.'});
			else
				return res.render('profile-submission', { error: 'An error occurred', json: JSON.stringify(req.body.emails) });
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