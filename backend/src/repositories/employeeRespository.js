const Employee = require("../../models/employee");

class EmployeeRepository {
  constructor() {
    this.model = Employee;
    this.transaction = null;
  }

  // Method to bind transaction
  bindTransaction(transaction) {
    this.transaction = transaction;
  }

  // Method to find employee by id
  async getEmployeeById(id, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.findByPk(id, { transaction });
  }

  // Method to find Employee by userId
  async getEmployeeByUserId(userId, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.findOne({ where: { userId }, transaction });
  }

  // Method to create new employee
  async createEmployee(employeeData, { transaction } = {}) {
    transaction = transaction || this.transaction;
    return await this.model.create(
      {
        userId: employeeData.userId,
        employerId: employeeData.employerId,
        salary: employeeData.salary,
        hireDate: employeeData.hireDate,
        position: employeeData.position,
        department: employeeData.department,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transaction,
      }
    );
  }

  // Method to update employee
  async updateEmployee(id, employeeData, { transaction } = null) {
    transaction = transaction || this.transaction;
    const employee = await this.getEmployeeById(id, { transaction });
    return await employee.update(
      {
        userId: employeeData.userId,
        employerId: employeeData.employerId,
        salary: employeeData.salary,
        hireDate: employeeData.hireDate,
        position: employeeData.position,
        department: employeeData.department,
        updatedAt: new Date(),
      },
      {
        transaction,
      }
    );
  }

  // Method to delete employee
  async deleteEmployee(id, { transaction } = {}) {
    transaction = transaction || this.transaction;
    const employee = await this.getEmployeeById(id, { transaction });
    return employee.destroy({ transaction });
  }
}

module.exports = new EmployeeRepository();
