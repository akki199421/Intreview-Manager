var _ = require('lodash');
var config = require('config.json');
var mongoose = require('mongoose');

//config 
mongoose.connect(config.dbUrl);

mongoose.connect.on('connected', function(){
	console.log('Data base conneceted');
});

mongoose.connect.on('error', function(err){
	console.log('Error ',err)
})



var services = {};

services.create = create;

module.exports = services;

function create(profile,done){
	console.log('inside create');
	var newProfile = new Profile(profile);
	newProfile.save(done);
}

