var Product = require('../models/productModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true});

var products = [
    new Product({
        imagePath:'https://i.pinimg.com/564x/41/2f/4e/412f4e281f2b2c3b42e48b2f9c4380a4.jpg',
        title:'Colorful Patronus',
        productId: '1',
        description:'Beautiful stag',
        price:15.99
    }),
    new Product({
        imagePath:'https://i.pinimg.com/564x/ea/6a/ef/ea6aeffeffa8a638673ebbb0a31c1e16.jpg',
        title:'Cherry Blossom',
        productId: '2',
        description:'Cherry Blossom tree in action.',
        price:10.00
    }),
    new Product({
        imagePath:'https://i.pinimg.com/564x/bb/0c/b9/bb0cb9d46260f9189d5078f36a090c2a.jpg',
        title:'The dancing lady',
        productId: '3',
        description:'Dance is the escape from boredom.',
        price:29.99
    })
];

var data = 0;
for(var i=0;i < products.length ;i++){
    products[i].save(function(err,result){
        data++;
        if(data === products.length){
            exit();
        }
    })
}

function exit(){
    mongoose.disconnect();
}
