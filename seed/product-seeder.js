var Product = require('../models/productModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath:'http://www.savegameworld.com/wp-content/uploads/2017/03/PC-Need-for-Speed-Carbon-SaveGame.jpg',
        title:'NFS Carbon',
        description:'Awesome Game!!!',
        price:15.99
    }),
    new Product({
        imagePath:'https://static-assets-prod.epicgames.com/fortnite/static/webpack/8704d4d5ffd1c315ac8e2c805a585764.jpg',
        title:'Fortnite Battle Royale',
        description:'Fortnite is an online video game first released in 2017 and developed by Epic Games. It is available as separate software packages having different game modes that otherwise share the same general gameplay and game engine.',
        price:0.00
    }),
    new Product({
        imagePath:'https://images-na.ssl-images-amazon.com/images/I/71cTCvSFJTL._SY500_.jpg',
        title:'PUBG',
        description:'PlayerUnknown\'s Battlegrounds is an online multiplayer battle royale game developed and published by PUBG Corporation, a subsidiary of South Korean video game company Bluehole.',
        price:29.99
    }),
    new Product({
        imagePath:'https://www.hitmanforum.com/uploads/hitmanforum/original/2X/4/4ad716896c4a0edca921ecb730ddd92462365a61.jpg',
        title:'Hitman',
        description:'Hitman is a stealth video game developed by IO Interactive. The game was published by Square Enix for Microsoft Windows, PlayStation 4, and Xbox One in an episodic format, starting in March 2016. A port for Linux, developed and published by Feral Interactive, was released in February 2017.',
        price:9.99
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
        title:'GTA V',
        description:'Grand Theft Auto V is an action-adventure video game developed by Rockstar North and published by Rockstar Games. It was released in September 2013 for PlayStation 3 and Xbox 360, in November 2014 for PlayStation 4 and Xbox One, and in April 2015 for Microsoft Windows.',
        price:19.99
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Left4Dead_Windows_cover.jpg/220px-Left4Dead_Windows_cover.jpg',
        title:'Left 4 Dead',
        description:'The Left 4 Dead franchise is based on a series of cooperative first-person shooter, survival horror video games developed by Valve Corporation. ',
        price:9.99
    }),
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
