// repositories/userRepository.js
const User = require("../../models/user");
const Helper = require("../utils/helpers");

class UserRepository {
  constructor() {
    this.model = User;
    this.transaction = null;
  }

  bindTransaction(transaction) {
    this.transaction = transaction;
  }

  // Method to get user by id
  async findById(id, { attributes = ["id"], transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.findByPk(id, { attributes, transaction });
  }

  // Method to find user by email
  async findUserByEmail(email, { attributes = ["id"], transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.findOne({
      where: { email },
      attributes,
      transaction,
    });
  }

  // Method to create a new user
  async createUser(userData, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const hashedPassword = await Helper.hashPassword(userData.password);
    return await this.model.create(
      {
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        fullName: userData.fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: userData.isActive || false,
      },
      { transaction }
    );
  }

  // Method to update user
  async updateUser(id, userData, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const user = await this.findById(id);
    return await user.update(
      {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        isActive: userData.isActive,
        updatedAt: new Date(),
      },
      { transaction }
    );
  }

  // Method to delete user
  async deleteUser(id, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const user = await this.findById(id, { transaction });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    await user.destroy({ transaction });
    return { success: true, message: "User deleted successfully" };
  }
}

module.exports = new UserRepository();
