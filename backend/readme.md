# waria API

**waria API** is a backend service designed to allow employers to grant salary advances to their employees. The system involves three main actors: Admin, Employer, and Employee, each with specific roles and actions. This API manages user authentication, salary advance requests, and salary payments. Employees can request salary advances, monitor the status of their requests, and check their balances, while employers can manage employee accounts and process bulk salary payments.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Admin**: Admin manages the entire system, overseeing employers and employees.
- **Employer**: Employers can register employees, manage salary advance requests, and make salary payments for all employees.
- **Employee**: Employees can request salary advances, view the status of their requests, and check their balance at any time.

## Technologies Used

- **Node.js**: The runtime environment used for building the backend API.
- **Express.js**: Web framework for building the RESTful API.
- **Sequelize ORM**: Object-Relational Mapping (ORM) to interact with the PostgreSQL database.
- **PostgreSQL**: The relational database used for storing user and transaction data.
- **JWT (JSON Web Tokens)**: For user authentication and authorization.
- **Nodemailer**: For sending emails to employees regarding registration and salary advance requests.
- **dotenv**: To load environment variables from a `.env` file.

## Installation

To get started with **waria API**, follow the steps below to set up the project on your local machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lordkode/waria.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd waria
   cd backend
   ```

3. **Install dependencies:**
   Use npm (Node Package Manager) to install all necessary dependencies:
   ```bash
   npm install
   ```

4. **Set up the environment variables:**
   - Create a `.env` file at the root of the project directory.
   - Add the necessary environment variables for database connection, JWT secret, and email service.
   Example of a `.env` file:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   MAIL_SERVICE=your_mail_service
   MAIL_USER=your_email_user
   MAIL_PASS=your_email_password
   ```

5. **Run the application:**
   After installation and configuration, start the server:
   ```bash
   npm start
   ```

6. The application will be available at `http://localhost:3000`.

## Configuration

To properly configure the API for your environment, you'll need to modify a few key variables:

1. **Database Configuration:**
   - Ensure that your PostgreSQL database is properly set up and accessible.
   - Add the correct `DATABASE_URL` in your `.env` file.

2. **Mail Service Configuration:**
   - Set up the email service provider (e.g., Gmail, SendGrid).
   - Add the `MAIL_SERVICE`, `MAIL_USER`, and `MAIL_PASS` in your `.env` file.

3. **JWT Configuration:**
   - Define a strong secret key for `JWT_SECRET` in the `.env` file to ensure secure token generation and validation.

## Usage

Once the server is running, you can interact with the API through the following endpoints. These endpoints allow you to manage users, salary advance requests, and payments.

### Key API Endpoints

- **POST /admin/register** - Register a new admin.
- **POST /employer/register** - Register a new employer.
- **POST /employer/login** - Employer login.
- **POST /employee/register** - Register a new employee (triggered by employer).
- **POST /employee/login** - Employee login.
- **POST /employee/request-advance** - Employee submits a salary advance request.
- **GET /employee/{id}/advance-status** - Get the status of a salary advance request.
- **GET /employee/{id}/balance** - Get employee balance at a specific date.
- **POST /employer/pay-salaries** - Employer makes salary payments for all employees.

### Authentication Flow

1. **Employer Registration & Login:**
   - Employers can register by providing basic information (email, company name, etc.).
   - Upon successful login, they will receive a JWT token that they must use to authenticate future requests.

2. **Employee Registration:**
   - After an employer registers an employee, the employee receives an email with a link to the app, their login credentials, and a link to download the app.
   - Employees can use their credentials to log into the app and start requesting salary advances.

3. **Salary Advance Requests:**
   - Employees can submit a salary advance request.
   - Employers can review the requests and process payments for all employees in bulk.

## Folder Structure

The project is organized into several key directories, each containing relevant files for a specific part of the application.

```
/salary-advance-api
├── /config              # Configuration files, including database and mail setup
├── /controllers         # Express.js route controllers for handling requests
├── /models              # Sequelize models for interacting with the database
├── /routes              # API routes
├── /services            # Business logic and services (email, JWT)
├── /middlewares         # Custom middleware for authentication and validation
├── /utils               # Utility functions and helpers
├── /migrations          # Sequelize database migrations
├── /seeders             # Sequelize seeders to populate the database
├── .env                 # Environment variables (not included in git)
├── .gitignore           # Git ignore file to exclude unnecessary files
├── server.js            # Entry point for the application
├── package.json         # NPM dependencies and scripts
└── README.md            # Project documentation
```

### Key Directories:

- **config**: Contains configuration files for database, email service, and other system settings.
- **controllers**: Handles the HTTP requests for the routes and interacts with the business logic.
- **models**: Defines Sequelize models for interacting with the PostgreSQL database.
- **routes**: Defines the API routes and maps them to appropriate controller actions.
- **services**: Contains the core logic for specific features like JWT generation, email sending, and payment processing.
- **middlewares**: Custom middlewares for authentication, validation, and error handling.
- **migrations**: Database migrations for schema changes.
- **seeders**: Seeder files for populating the database with initial data (e.g., admin user).

## Testing

To run the tests for this API, follow the steps below:

1. Install testing dependencies:
   ```bash
   npm install --save-dev mocha chai supertest
   ```

2. Create test files in the `tests` directory.

3. Run tests using:
   ```bash
   npm test
   ```

You can also use **Postman** or **Insomnia** to manually test the API endpoints.

## Contributing

We welcome contributions from the open-source community! If you would like to contribute, follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and write tests.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request to the main branch.

Please make sure to follow the code style and write clear commit messages.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For more information or questions, feel free to contact the project owner via GitHub Issues or directly by email at `atirichardessotina@gmail.com`.