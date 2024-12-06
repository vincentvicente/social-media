const jwt = require('jsonwebtoken');


const SECRET_KEY = "bananabanananbanan";

function generateToken(payload) {

    return jwt.sign({payload}, SECRET_KEY, {
        expiresIn: '14d'
    });

}

function decrypt(token) {
    try {
        const decoded =  jwt.verify(token, SECRET_KEY)
        return decoded.payload;
    } catch (err) {
        return false;        
    }
}

module.exports = {
    generateToken,
    decrypt,
}