var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Product = require('../models/productModel');
var User = require('../models/userModel');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res) {
    Product.find(function (err,docs){
        var chunks = [];
        var chunkSize = 3;
        for(var i=0;i<docs.length;i+=chunkSize){
            chunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart',products: chunks });
    });
});



module.exports = router;
