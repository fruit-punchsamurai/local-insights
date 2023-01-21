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
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    isGuide: {
        type: Boolean,
        required: true
    },
    __link: {
        collectionName: {
            type: String,
            required: false
        },
        id: {
            type: mongoose.Types.ObjectId,
            required: false
        }
    }
});

const UserInfo = mongoose.model("UserInfo", userInfoSchema, "userInfo");
module.exports = UserInfo
