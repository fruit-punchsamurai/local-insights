const express = require('express');
const OTP = require('../sparrow/otp');
const otpRouter = express.Router();

// Map to store OTPs and their expiry timestamps
const otpMap = new Map();

otpRouter.post('/', async (req, res, next) => {
    const { phoneNumber } = req.body;
    const otp = OTP.generate();
    try {
       await OTP.send(phoneNumber, otp);
    } catch (err) {
        return res.status(400).send({ errors: 'Error sending OTP' });
    }

    // Set the OTP in the map with a timestamp 15 minutes from now
    otpMap.set(phoneNumber, { otp: otp, expiry: Date.now() + 15 * 60 * 1000 });
    res.status(200).json({ message: 'OTP sent successfully' });
});

otpRouter.post('/verify', async (req, res, next) => {
    const { phoneNumber, enteredOtp } = req.body;
    clearOTPs();

    // Check if the phone number is present in the map
    if (!otpMap.has(phoneNumber)) {
        return res.status(400).send({ errors: 'Invalid phone number or OTP has expired' });
    }

    const { otp, expiry } = otpMap.get(phoneNumber);
    if (expiry < Date.now()) {
        // delete the map if it is expired
        otpMap.delete(phoneNumber);
        return res.status(400).send({ errors: 'OTP has expired' });
    }
    // verify OTP
    const verified = OTP.verify(toString(otp), toString(enteredOtp));
    if (!verified) {
        return res.status(400).send({ errors: 'Invalid OTP' });
    }
    // delete the map after verification
    otpMap.delete(phoneNumber);
    res.send({ verified });
});

// route to check expiry of otp
function clearOTPs() {
    for (const [phoneNumber, { expiry }] of otpMap) {
        if (expiry < Date.now()) {
            otpMap.delete(phoneNumber);
        }
    }
};

module.exports = otpRouter;

