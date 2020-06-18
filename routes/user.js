var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var Product = require('../models/productModel');
var User = require('../models/userModel');
var Cart = require('../models/cart');
var Order = require('../models/order');

var csrfProtection = csrf();
router.use(csrfProtection);



router.get('/profile', isLoggedIn,function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        })
        res.render('user/profile', {orders: orders, user:req.user});
    });
});

router.get('/admin-profile', isLoggedIn,function (req, res, next) {
    res.render('user/admin-profile',{csrfToken: req.csrfToken()})
});

router.get('/logout', isLoggedIn,function (req,res,next) {
    req.logout();
    res.redirect('/');
});



router.use('/',notLoggedIn, function (req,res,next) {
    next();
})

router.get('/signup',function (req,res,next) {
    var messages = req.flash('error');
    console.log('get signup called ',messages);
    res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0})
});

router.post('/signup',passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldURL){
        var oldUrl = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


router.get('/admin-signin', function (req,res,next) {
    var messages = req.flash('error');
    res.render('user/admin-signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0})
});

router.post('/admin-signin',passport.authenticate('local.signin',{
    failureRedirect: '/user/admin-signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldURL){
        var oldUrl = req.session.oldURL;
        req.session.oldURL = null;
        console.log(oldUrl);
        res.redirect(oldUrl);
    } else {
        console.log('res locals', res.locals);
        res.locals.isAdmin = 1;
        console.log('res locals', res.locals);
        res.redirect('/user/admin-profile');
    }
});

router.get('/signin',function (req,res,next) {
    var messages = req.flash('error');
    console.log('get signup called ',messages);
    res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0})
});

router.post('/signin',passport.authenticate('local.signin',{
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldURL){
        var oldUrl = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
