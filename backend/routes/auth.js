const express = require('express');
const sha256 = require('sha256');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();
const UserModel = require('../models/authModel');
const UserInfo = require('../models/userInfoModel')
const GuideInfo = require('../models/guideModel')
const {secretkey} = require('../config')
authRouter.post('/create', async (req, res, next) => {
    const user = req.body
    try {
        let { email, hash } = user;
        let exists = await UserModel.findOne({ email });
        if (exists) throw { errors: "{\"email\":{\"name\":\"ValidatorError\",\"message\":\"Email already exists\",\"properties\":{\"message\":\"Email already exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"duplicate\",\"path\":\"email\"}" };
        if (!hash) throw { errors: "No password" }

        //set guideInfo
        let { ...uInfo } = user.userInfo;
        let newGuide = {};
        if (uInfo.isGuide == 'true') {
            let gInfo = user.guideInfo;
            gInfo.averageRating = null;
            gInfo.totalServices = 0;
            newGuide = await GuideInfo.create(gInfo)
        }
        //set userInfo
        uInfo.__link = { collectionName: "guideInfo", id: newGuide.id };
        const newUser = await UserInfo.create(uInfo)

        let salt = crypto.randomBytes(16).toString('hex');
        let newPass = hash + salt;
        let newHash = sha256(newPass);
        const newAuthInfo = await UserModel.create({ email, hash: newHash, salt, __link: { collectionName: "userInfo", id: newUser.id } });
        
        res.send({ id: newAuthInfo.id, email });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
    }
});

authRouter.post('/login', async (req, res, next) => {
    let token = req.headers['x-auth-token'];
    let user;
    let donotgenerate = false;
    if(!token){
        user= req.body
    } else{
        donotgenerate = true;
        //decrypt token and set user to decrypted value
        //handle thrown error
        try{
            user = jwt.verify(token, secretkey );
        }catch(err){
            return res.status(400).json({errors: `${err}`})
        }
    }

    try {
        let {hash, salt, ...existential} = await UserModel.findOne({ email:user.email });
        let exists = {email: existential._doc.email, _id: existential._doc._id}
        if (!exists) throw { errors: "{\"email\":{\"name\":\"AccountError\",\"message\":\"Email doesn't exists\",\"properties\":{\"message\":\"Email doesn't exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"404\",\"path\":\"email\"}" }
        let newPass = user.hash + salt;
        let newHash = sha256(newPass);
        if (newHash == hash) {
            if(!donotgenerate)
                token = jwt.sign({email:user.email,hash:user.hash}, secretkey,  { expiresIn: "5s" });
            exists.token = token;
            res.status(200).json(exists);
        } else {
            throw { errors: "{\"hash\":{\"name\":\"ValidatorError\",\"message\":\"Password doesn't match\",\"properties\":{\"message\":\"Password doesn't match\",\"type\":\"required\",\"path\":\"hash\"},\"kind\":\"400\",\"path\":\"hash\"}" }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
    }
});

authRouter.patch('/reset', async (req, res, next) => {
    const { email, hash } = req.body
    try {
        let exists = await UserModel.findOne({ email });
        if (!exists) throw { errors: "{\"email\":{\"name\":\"AccountError\",\"message\":\"Email doesn't exists\",\"properties\":{\"message\":\"Email doesn't exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"404\",\"path\":\"email\"}" }
        if (sha256((req.body.old + exists.salt)) != exists.hash) throw { errors: "{\"old\":{\"name\":\"ValidatorError\",\"message\":\"Password doesn't match\",\"properties\":{\"message\":\"Password doesn't match\",\"type\":\"required\",\"path\":\"old\"},\"kind\":\"400\",\"path\":\"old\"}" }
        let salt = crypto.randomBytes(16).toString('hex')
        let newPass = hash + salt
        let newHash = sha256(newPass)
        let newData = await UserModel.updateOne(exists, { hash: newHash, salt })
        console.log(newData)
        res.status(200).json({ id: exists.id, email: exists.email, success: true });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
    }
});

module.exports = authRouter;