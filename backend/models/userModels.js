const mongoose = require("mongoose");


const userInfoSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true
    },
    isGuide:{
        type: Boolean,
        required:true
    }
});

const UserInfo = mongoose.model("UserInfo", userInfoSchema, "userInfo");
module.exports = UserInfo
