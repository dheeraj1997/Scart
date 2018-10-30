var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Product = require('../models/productModel');
var User = require('../models/userModel');
var Cart = require('../models/cart');
var Order = require('../models/order');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err,docs){
        var chunks = [];
        var chunkSize = 3;
        for(var i=0;i<docs.length;i+=chunkSize){
            chunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: chunks, successMsg: successMsg, noMessages: !successMsg });
    });
});

router.get('/add-to-cart/:id',function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{});
    // console.log(req.session.cart.totalQty);
    Product.findById(productId, function (err, product) {
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    })
});

router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart){
        return res.render('shop/shopping-cart',{products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart',{products:cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    console.log('csrf Token: ', req.csrfToken());
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout',{total:cart.totalPrice, errMsg, noErrors: !errMsg, csrfToken: req.csrfToken()});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")("sk_test_P97Gp3SdF1ll1QCrYQpHfNz3");

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge for Test jenny.rosen@example.com"
    }, function(err, charge) {
        // asynchronously called
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            if(err){
                console.log('error occurred');
            }
            req.flash('success', 'Successfully bought the product.');
            req.session.cart = null;
            res.redirect('/');
        });

    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldURL = req.url;
    res.redirect('/user/signin');
}
