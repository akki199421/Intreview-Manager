var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res){
	res.render('register');
});

router.post('/', function(req, res){
	request.post({
        url: config.apiUrl + '/user/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: error });
        }

        if (response.statusCode !== 200) {
        	console.log('statusCode is not 200');
            return res.render('register', {
                error: response.body,
                name: req.body.name,
                email: req.body.email
            });
        }


        // return to login with success message
        req.session.success = 'An email has been sent to the registerd email id. Please verify.';
        return res.redirect('/login');
    });
})

module.exports = router;
