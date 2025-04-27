const userRepository = require("../repositories/userRepository");
const ResponseHandler = require("../utils/responseHandler");

class UserService {
  constructor(repository = userRepository) {
    this.userRepository = repository;
  }

  // Method to get user by id
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    return ResponseHandler.success(user);
  }

  // Method to get user by email
  async getUserByEmail(email) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    return ResponseHandler.success(user);
  }

  // Method to create a new user
  async createUser(userData) {
    const newUser = await this.userRepository.createUser(userData);
    return ResponseHandler.success(newUser);
  }

  //Method to update user
  async updateUser(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    const updatedUser = await this.userRepository.updateUser(id, userData);
    return ResponseHandler.success(updatedUser);
  }

  // Method to delete user
  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return ResponseHandler.failure("User not found");
    }
    await this.userRepository.deleteUser(id);
    return ResponseHandler.success("User deleted successfully");
  }
}
module.exports = UserService;
