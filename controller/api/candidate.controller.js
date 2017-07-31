var express = require('express');
var router = express.Router();
var config = require('config.json');
var request = require('request');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir=path.join(__dirname, '../../uploads/');
        console.log("Hello people in storage" , dir);

    return cb(null, dir);
  }
})
var upload = multer({ storage: storage }).single('file');
var profileModel = require('models/profiles');


router.post('/all', fetchAllProfiles);
router.post('/update-reivew', updateReview);
router.post('/update-comment', updateComment);

function fetchAllProfiles(req, res){
	console.log('fetch all profiles');
	profileModel.fetchAll(function(err, profiles){
		console.log('fetch all request sent');
		if(err){
			console.log('error fetching all');
			res.status(404).send(err);
		}
		else{
			console.log('fetch all success', profiles);
			res.status(200).send(profiles);
		}
	});
}

function updateReview(req, res){
	console.log('updateProfile', req.body);
	profileModel.updateRew(req.body,function(err){
		console.log('update request sent');
		if(err){
			console.log('error updating', err);
			res.status(401).send(err);
		}
		console.log('back in updateProfile');
		res.status(200).send('done');
	})
}

function updateComment(req, res){
	profileModel.updateCom(req.body, function(err){
		console.log('update comment sent');
		if(err){
			console.log('eroor in comment',err);
			res.status(401).send(err);
		}
		res.status(200).send('done');
	})
}

router.post('/submission',   function (req, res){
	console.log('submitProfile dd',req.body);
	profileModel.create(req.body,function(err, profile){
		if(err){
			console.log(err);
			if(err.code  === 11000)
			res.status(401).send('A profile with email: ' + req.body.emails + ' already exists.');
		}
		else{
			// uploadFile(req.body.attachement,user.id);
			// request.post({
			//  url: '/upload-file',
			//  form: req.body
			// },function (error,response,body){
			// 	console.log('done error', error);
			// })
			upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return
    }
    console.log('ok');
    // Everything went fine
  })
			res.sendStatus(200);
			console.log(profile.id);
		}
	});
	
});

function uploadFile(file,id){
	console.log('inside upload',file);
	upload.single(file);
}

module.exports = router;