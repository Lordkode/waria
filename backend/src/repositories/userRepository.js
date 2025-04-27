// repositories/userRepository.js
const User = require("../../models/user");
const Helper = require("../utils/helpers");

class UserRepository {
  constructor() {
    this.model = User;
  }

  // Method to get user by id
  async findById(id) {
    return await this.model.findByPk(id);
  }

  // Method to find user by email
  async findUserByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }

  // Method to create a new user
  async createUser(userData) {
    const hashedPassword = await Helper.hashPassword(userData.password);
    return await this.model.create({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      fullName: userData.fullName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: userData.isActive || false,
    });
  }

  // Method to update user
  async updateUser(id, userData) {
    const user = await this.findById(id);
    return await user.update({
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      updatedAt: new Date(),
    });
  }

  // Method to delete user
  async deleteUser(id) {
    const user = await this.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    await user.destroy();
    return { success: true, message: "User deleted successfully" };
  }
}

module.exports = new UserRepository();
