var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    name:{type:String, required: false},
    userId:{type:String, required:false},
    address: {type: String, required:false},
    dob: {type:String, required: false},
    email:{type:String,required:true},
    password:{type:String,required:true},
    isAdmin:{type:Number, default: 0}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};


module.exports = mongoose.model('User',userSchema);
