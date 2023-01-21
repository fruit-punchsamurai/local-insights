const mongoose = require("mongoose");


const userInfoSchema = mongoose.Schema({
    gender:{
        type: String,
        required:true
    },
    averageRatings:{
        type: Number,
        required:true
    },
    totalService:{
        type: Number,
        required:true
    },
    desiredDestination:{
        type: String,
        required:true
    },
    __link:{
        collectionName:{
            type: String,
            required: true
        },
        id:{
            type:mongoose.Types.ObjectId,
            required: true
        }
    }
});

const GuideInfo = mongoose.model("GuideInfo", userInfoSchema, "guideInfo");
module.exports = GuideInfo
