const EmployeurRepository = require("../repositories/employerRepository");
const ResponseHandler = require("../utils/responseHandler");

class EmployerService {
  constructor(repository = EmployeurRepository) {
    this.employerRepository = repository;
  }

  // Method to Get employer by id
  async getEmployerById(id, { transaction }) {
    const employer = await this.employerRepository.findById(id, {
      transaction,
    });

    return employer;
  }

  // Method to Get employeur by user id
  async getEmployerByUserId(userId, { transaction }) {
    const employer = await this.employerRepository.findByUserId(userId, {
      transaction,
    });
    return employer;
  }
  // Method to create a new employer
  async createEmployer(employerData, { transaction } = {}) {
    const newEmployer = await this.employerRepository.createEmployer(
      employerData,
      { transaction }
    );
    return ResponseHandler.success(newEmployer);
  }

  // Method to update employer
  async updateEmployer(id, employerData, { transaction } = {}) {
    const employer = await this.employerRepository.findByUserId(
      employerData.userId,
      { transaction }
    );
    if (!employer) {
      return ResponseHandler.failure("Employer not found");
    }
    const updatedEmployer = await this.employerRepository.updateEmployer(
      id,
      employerData,
      { transaction }
    );
    return ResponseHandler.success(updatedEmployer);
  }
}

module.exports = EmployerService;
