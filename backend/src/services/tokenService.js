const jwt = require("jsonwebtoken");

class TokenService {
  constructor() {
    this.accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
    this.refreshTokenSecret =
      process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret";
    this.accessTokenExpiry = "15m";
    this.refreshTokenExpiry = "7d";
  }

  // Method to generate access token
  generateAccessToken(user) {
    return jwt.sign(user, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  // Method to generate refresh token
  generateRefreshToken(user) {
    return jwt.sign(user, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  // Method to verify access token
  verifyAccessToken(token) {
    return jwt.verify(token, this.accessTokenSecret);
  }

  // Method to verify refresh token
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshTokenSecret);
  }

  // Method to decode token
  decodeToken(token) {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return payload;
    } catch (error) {
      return console.error("Token verify error:", error);
    }
  }
}

module.exports = new TokenService();
