const express = require('express')
const Auth = require('../models/authModel.js')
const UserInfo = require('../models/userInfoModel.js')
const GuideInfo = require('../models/guideModel.js');
const searchRouter = express.Router();


searchRouter.post('/', async (req, res) => {
  let user = req.body;
  let TotalData = {};
  const AuthInfo = await Auth.findOne({ _id: user.id });
  const { firstName, lastName, gender, dateOfBirth, ContactNumber, ...UserData } = await UserInfo.findOne({ _id: AuthInfo.__link.id });
  if (UserData._doc.isGuide == true) {
    let { averageRating, totalServices, location } = await GuideInfo.findOne({ _id: UserData._doc.__link.id });
    TotalData.GuideInfo = { averageRating, totalServices, location };
  }
  TotalData.UserInfo = { firstName, lastName, gender, dateOfBirth, ContactNumber };
  res.status(200).json(TotalData);
});

module.exports = searchRouter