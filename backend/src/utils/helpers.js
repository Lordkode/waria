const bcrypt = require('bcrypt');
const crypto = require('crypto');

class Helper{
    // Method to generate random UUID
    generateUUID(){
        return crypto.randomUUID();
    }

    // Method to hash password
    async hashPassword(password){
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    // Method to compare password
    async comparePassword(password, hash){
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new Helper();