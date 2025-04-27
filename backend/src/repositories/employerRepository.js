const Employer = require("../../models/employer");

class EmployeurRepository {
  constructor() {
    this.model = Employer;
  }

  // Method to create a new employer
  async createEmployer(employerData) {
    return await this.model.create({
      userId: employerData.userId,
      companyName: employerData.companyName,
      companyRegistrationNumber: employerData.companyRegistrationNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Method to get employer by id
  async findById(id) {
    return await this.model.findByPk(id);
  }

  // Method to get employeur by userId
  async findByUserId(userId) {
    return this.model.findOne({ where: { userId } });
  }

  // Method to update empployer
  async updateEmployer(id, employerData) {
    const employer = await this.findById(id);
    return await employer.update({
      userId: employerData.userId,
      companyName: employerData.companyName,
      companyRegistrationNumber: employerData.companyRegistrationNumber,
      updatedAt: new Date(),
    });

  }
}

module.exports = new EmployeurRepository();
