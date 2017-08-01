var express = require('express');
var router = express.Router();

// use session auth 
router.use('/', function (req, res, next) {
    if (req.path !== '/logout' && !req.session.token) {
        return res.redirect('/login');
    }
    next();
});

// make JWT token available to angular
router.get('/token', function (req, res) {
    res.send(req.session.token);
});

// angular files
router.use('/', express.static('app'));

module.exports = router;