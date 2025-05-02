const bcrypt = require("bcrypt");
const crypto = require("crypto");

class Helper {
  // Method to generate random UUID
  generateUUID() {
    return crypto.randomUUID();
  }

  // Method to hash password
  async hashPassword(password) {
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
  async comparePassword(password, hash) {
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

  // Method to generate verification code
  generateConfirmationCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }

  // Generte username
  generateUserName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const lastTwo = parts.slice(-2).join("");
    const username = lastTwo.toLowerCase();

    return username;
  }

  // Generate random password
  generatePassword(length = 8) {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&*()_+!~`-=[]{},.<>?/|";

    const allChars = lowercase + uppercase + numbers + symbols;

    const required = [
      lowercase[Math.floor(Math.random() * lowercase.length)],
      uppercase[Math.floor(Math.random() * uppercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    let password = required;

    for (let i = required.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    return password.sort(() => Math.random() - 0.5).join("");
  }
}

module.exports = new Helper();
