const Employer = require("../../models/employer");

class EmployeurRepository {
  constructor() {
    this.model = Employer;
    this.transaction = null;
  }

  // Bind transaction
  bindTransaction(transaction) {
    this.transaction = transaction;
  }

  // Method to create a new employer
  async createEmployer(employerData, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.create(
      {
        userId: employerData.userId,
        companyName: employerData.companyName,
        companyRegistrationNumber: employerData.companyRegistrationNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction }
    );
  }

  // Method to get employer by id
  async findById(id, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.findByPk(id, { transaction });
  }

  // Method to get employeur by userId
  async findByUserId(userId, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return this.model.findOne({ where: { userId }, transaction });
  }

  // Method to update empployer
  async updateEmployer(id, employerData, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const employer = await this.findById(id, { transaction });
    return await employer.update(
      {
        userId: employerData.userId,
        companyName: employerData.companyName,
        companyRegistrationNumber: employerData.companyRegistrationNumber,
        updatedAt: new Date(),
      },
      { transaction }
    );
  }

  // Method to delete employer
  async deleteEmployer(id, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const employer = await this.findById(id, { transaction });
    return await employer.destroy({ transaction });
  }
}

module.exports = new EmployeurRepository();
