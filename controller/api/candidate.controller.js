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