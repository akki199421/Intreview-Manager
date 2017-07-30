var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res){
	res.render('register');
	console.log('register');
});

router.post('/', function(req, res){
	request.post({
        url: config.apiUrl + '/user/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
    	console.log('back in controller');
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
        	console.log('statusCode is not 200');
            return res.render('register', {
                error: response.body,
                name: req.body.name,
                email: req.body.email
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        console.log('successful')
        return res.redirect('/login');
    });
})

module.exports = router;
