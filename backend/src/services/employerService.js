const EmployeurRepository = require("../repositories/employerRepository");
const ResponseHandler = require("../utils/responseHandler");

class EmployerService {
  constructor(repository = EmployeurRepository) {
    this.employerRepository = repository;
  }

  // Method to create a new employer
  async createEmployer(employerData) {
    const newEmployer = await this.employerRepository.createEmployer(
      employerData
    );
    return ResponseHandler.success(newEmployer);
  }

  // Method to update employer
  async updateEmployer(id, employerData) {
    const employer = await this.employerRepository.findByUserId(
      employerData.userId
    );
    if (!employer) {
      return ResponseHandler.failure("Employer not found");
    }
    const updatedEmployer = await this.employerRepository.updateEmployer(
      id,
      employerData
    );
    return ResponseHandler.success(updatedEmployer);
  }
}

module.exports = EmployerService;
