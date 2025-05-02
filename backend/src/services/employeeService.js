const EmployeeRepository = require("../repositories/employeeRespository");
const ResponseHandler = require("../utils/responseHandler");

class EmployeeService {
  constructor(repository = EmployeeRepository) {
    this.EmployeeRepository = repository;
  }

  // Method to create new employee
  async createEmployee(employeeData, { transaction } = {}) {
    const newEmployee = await this.EmployeeRepository.createEmployee(
      employeeData,
      { transaction }
    );

    return ResponseHandler.success(newEmployee);
  }

  // Method to update employee
  async updateEmployee(id, employeeData, { transaction }) {
    const employee = await this.EmployeeRepository.getEmployeeById(id, {
      transaction,
    });

    if (!employee) return ResponseHandler.failure("Employee not found !");

    const updatedEmployee = await this.EmployeeRepository.updateEmployee(
      id,
      employeeData,
      { transaction }
    );

    return ResponseHandler.success(updatedEmployee);
  }

  // Method to delete Employee
  async deleteEmployee(id, { transaction }) {
    const employee = await this.getEmployeeById(id, { transaction });
    if (!employee) ResponseHandler.failure("Employee not found !");
    const deletedEmployee = await this.EmployeeRepository.deleteEmployee(id, {
      transaction,
    });
    return ResponseHandler.success(deletedEmployee);
  }
}

module.exports = EmployeeService;
