const express = require('express');
const OTP = require('../sparrow/otp');
const otpRouter = express.Router();


otpRouter.post('/otp', async (req, res, next) => {
    const { phoneNumber } = req.body;
    const otp = OTP.generate();
    OTP.send(phoneNumber, otp);
});

otpRouter.post('/verify', async (req, res, next) => {
    const { otp, enteredOtp } = req.body;
    const verified = OTP.verify(otp, enteredOtp);
    res.send({ verified });
});

