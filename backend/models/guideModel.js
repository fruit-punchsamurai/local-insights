const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema({
    averageRating: {
        type: Number,
        required: false
    },
    totalServices: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const GuideInfo = mongoose.model("GuideInfo", userInfoSchema, "guideInfo");
module.exports = GuideInfo
