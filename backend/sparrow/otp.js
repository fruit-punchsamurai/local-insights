const { SparrowToken } = require('../config');
const axios = require('axios');

const OTP = (function () {
    function generate() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    async function send(phoneNumber, otp) {
        // send OTP via SMS or email
        // fetch("http://api.sparrowsms.com/v2/sms/",
        //     data = {
        //         token: SparrowToken,
        //         from: 'TheAlert',
        //         to: toString(phoneNumber),
        //         text: 'Your OTP is ' + otp +'. Please do not share this with anyone.'
        //     }).then(res => res.json())
        //     .then(res => console.log(res));
        const res = await axios.get('http://api.sparrowsms.com/v2/sms/', {
            params: {
                token: SparrowToken,
                from: 'TheAlert',
                to: `${phoneNumber}`,
                text: 'Your OTP is ' + otp + '. Please do not share this with anyone.'
                }
            })
        console.log(res);
    };
        // verify OTP
        function verify(otp, enteredOtp) {
            return otp === enteredOtp;
        }

        // expose functions
        return {
            generate,
            send,
            verify
        };
    }) ();

    // // usage
    // const otp = OTP.generate();
    // OTP.send("9865249726");
    module.exports = OTP;