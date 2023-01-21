const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    hash: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function (value) {
                return value.length >= 6
            },
            message: () => 'Password must be at least six characters long'
        }
    },
    salt:{
        type: String,
        required: [true, 'Salt is required'],
        validate: {
            validator: function (value){
                return value.length >=5
            },
            message: ()=> 'Salt must be at least five characters long'
        }
    }
})

const UserModel = mongoose.model('Auth', userSchema, 'Auth');
module.exports = UserModel;