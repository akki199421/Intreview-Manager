var express = require('express');
var router = express.Router();
var config = require('config.json');
var request = require('request');
var profileModel = require('models/profiles');


router.post('/all', fetchAllProfiles);
router.post('/update-reivew', updateReview);
router.post('/update-comment', updateComment);


function fetchAllProfiles(req, res){
	profileModel.fetchAll(function(err, profiles){
		if(err){
			res.status(404).send(err);
		}
		else{
			res.status(200).send(profiles);
		}
	});
}

function updateReview(req, res){
	profileModel.updateRew(req.body,function(err){
		if(err){
			res.status(401).send(err);
		}
		res.status(200).send('done');
	})
}

function updateComment(req, res){
	profileModel.updateCom(req.body, function(err){
		if(err){
			res.status(401).send(err);
		}
		res.status(200).send('done');
	})
}


module.exports = router;