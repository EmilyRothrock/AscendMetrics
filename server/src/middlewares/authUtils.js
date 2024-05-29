const crypto = require('crypto');

// Helper Functions for Authentication
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = myHashify(password, salt);
    return { hash: genHash, salt: salt };
}

function validatePassword(password, hash, salt) {
    var hashVerify = myHashify(password, salt);
    return hash === hashVerify;
}

function myHashify(password, salt) {
    // Key length can be adjusted as needed; 64 bytes is a common length
    const keyLength = 64;
    
    // Use crypto.scryptSync to derive a key from the password and salt
    const hash = crypto.scryptSync(password, salt, keyLength);
    
    // Return the hash as a hexadecimal string
    return hash.toString('hex');
}
    
module.exports = {
    genPassword,
    validatePassword
}