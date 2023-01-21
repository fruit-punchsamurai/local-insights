const express = require('express');
const sha256 = require('sha256');
const crypto = require('crypto');
const authRouter = express.Router();
const UserModel = require('../models/authModel');
const UserInfo = require('../models/userModels')


authRouter.post('/create', async (req, res, next) =>{
    const user = req.body
    try{
        let {email, hash} = user;
        let exists = await UserModel.findOne({email});
        if (exists) throw {errors: "{\"email\":{\"name\":\"ValidatorError\",\"message\":\"Email already exists\",\"properties\":{\"message\":\"Email already exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"duplicate\",\"path\":\"email\"}"};
        if (!hash) throw {errors: "No password"}
        let salt = crypto.randomBytes(16).toString('hex');
        let newPass = hash + salt;
        let newHash = sha256(newPass);
        const {id} = await UserModel.create({email, hash: newHash, salt});
        let {...uInfo}= user.userInfo
        let {...gInfo}=user.guideInfo
        console.log(uInfo)
        console.log(gInfo)
        uInfo.__link ={collectionName:"Auth",id}
        const newUser = await UserInfo.create(uInfo)
        if (user.isGuide==true){
        const newGuide = await GuideInfo.create(gInfo)
    }
        if(!newUser) await UserModel.deleteOne({id})
        res.send({id,email});
    }catch(err){
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
    }
});

authRouter.post('/login', async (req, res, next) =>{
    const {email, hash} = req.body
    try{
        let exists = await UserModel.findOne({email});
        if (!exists) throw {errors: "{\"email\":{\"name\":\"AccountError\",\"message\":\"Email doesn't exists\",\"properties\":{\"message\":\"Email doesn't exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"404\",\"path\":\"email\"}"}
        let newPass = hash + exists.salt;
        let newHash = sha256(newPass);
        if(newHash == exists.hash){
            res.status(200).json({email: exists.email, login: 'success', token: 'randomgibberish'});
        }else{
            throw {errors: "{\"hash\":{\"name\":\"ValidatorError\",\"message\":\"Password doesn't match\",\"properties\":{\"message\":\"Password doesn't match\",\"type\":\"required\",\"path\":\"hash\"},\"kind\":\"400\",\"path\":\"hash\"}"}
        }
    }catch(err){
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
    }
});

authRouter.patch('/reset', async (req, res, next) =>{
    const {email, hash} = req.body
    try{
        let exists = await UserModel.findOne({email});
        if (!exists) throw {errors: "{\"email\":{\"name\":\"AccountError\",\"message\":\"Email doesn't exists\",\"properties\":{\"message\":\"Email doesn't exists\",\"type\":\"required\",\"path\":\"email\"},\"kind\":\"404\",\"path\":\"email\"}"}
        if(sha256((req.body.old+exists.salt))!=exists.hash) throw {errors: "{\"old\":{\"name\":\"ValidatorError\",\"message\":\"Password doesn't match\",\"properties\":{\"message\":\"Password doesn't match\",\"type\":\"required\",\"path\":\"old\"},\"kind\":\"400\",\"path\":\"old\"}"}
        let salt = crypto.randomBytes(16).toString('hex')
        let newPass= hash +salt
        let newHash= sha256(newPass)
        let newData = await UserModel.updateOne(exists,{hash:newHash,salt})
        console.log(newData)
        res.status(200).json({id:exists.id,email:exists.email,success:true});
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            errors: `${JSON.stringify(err.errors)}`
        });
        }
});


module.exports = authRouter;