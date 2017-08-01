var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res){
	 delete req.session.token;

    // move success message into local 
    var success = { success: req.session.success };
    delete req.session.success;

	res.render('login', success);
});

router.post('/', function(req, res){
	request.post({
        url: config.apiUrl + '/user/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }
        if (!body.token) {
            return res.render('login', { error: body, email: req.body.email });
        }

        // save JWT token in session 
        req.session.token = body.token;
        res.redirect('/app');
    });
})

module.exports = router;
