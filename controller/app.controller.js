var express = require('express');
var router = express.Router();

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
	console.log('app',req.session.token,req.path !== '/logout' && !req.session.token);
    if (req.path !== '/logout' && !req.session.token) {
        return res.redirect('/login');
    }
    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;