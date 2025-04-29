const userRepository = require("../repositories/userRepository");
const ResponseHandler = require("../utils/responseHandler");

class UserService {
  constructor(repository = userRepository) {
    this.userRepository = repository;
  }

  // Method to get user by id
  async getUserById(id, { transaction } = {}) {
    const user = await this.userRepository.findById(id, { transaction });
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    return ResponseHandler.success(user);
  }

  // Method to get user by email
  async getUserByEmail(email, { transaction } = {}) {
    const user = await this.userRepository.findUserByEmail(email, {
      transaction,
    });
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    return ResponseHandler.success(user);
  }

  // Method to create a new user
  async createUser(userData, { transaction } = {}) {
    const newUser = await this.userRepository.createUser(userData, {
      transaction,
    });
    return ResponseHandler.success(newUser);
  }

  //Method to update user
  async updateUser(id, userData, { transaction } = {}) {
    const user = await this.userRepository.findById(id, { transaction });
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    const updatedUser = await this.userRepository.updateUser(id, userData, {
      transaction,
    });
    return ResponseHandler.success(updatedUser);
  }

  // Method to delete user
  async deleteUser(id, { transaction } = {}) {
    const user = await this.userRepository.findById(id, { transaction });
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    await this.userRepository.deleteUser(id, { transaction });
    return ResponseHandler.success("User deleted successfully");
  }
}
module.exports = UserService;
