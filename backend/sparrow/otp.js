const { SparrowToken } = require('../config');
const axios = require('axios');

const OTP = (function () {
    function generate() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    async function send(phoneNumber, otp) {
        try {
            await axios.get('http://api.sparrowsms.com/v2/sms/', {
                params: {
                    token: SparrowToken,
                    from: 'TheAlert',
                    to: `${phoneNumber}`,
                    text: 'Your OTP is ' + otp + '. Please do not share this with anyone.'
                }
            })
        } catch (err) {
            throw { errors: 'Error sending OTP' };
        };
    }
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
})();

module.exports = OTP;