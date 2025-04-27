# Code Style Guide

This document defines the code formatting, naming conventions, and best practices for this project. All contributors must follow these rules to ensure consistency and readability across the codebase.

## 1. Language

The primary languages used in this project are:
- **JavaScript/Node.js**
- **Sequelize ORM**
- **PostgreSQL**

## 2. File Naming

- Use `camelCase` for files containing functions or logic: `userService.js`
- Use `kebab-case` for migration and seeder files: `20230425-create-users.js`

## 3. Indentation & Formatting

- Use **2 spaces** for indentation
- Use **trailing commas** where possible in objects and arrays
- Use **single quotes** for strings: `'example'` not `"example"`
- Always use **semicolons**

> You can enforce this using Prettier or ESLint

## 4. Variable & Function Naming

- Use `camelCase` for variable and function names: `getUserById()`
- Use `PascalCase` for class names: `UserService`
- Constants must be in `UPPER_SNAKE_CASE`: `DEFAULT_ROLE_ID`

## 5. Comments

- Use inline comments **sparingly and meaningfully**
- For blocks or complex logic, use block comments:
```js
// Get user by ID and check if active
```

## 6. Migrations

- Use `snake_case` for table and column names
- Always include `createdAt` and `updatedAt` fields
- Use UUIDs as primary keys

## 7. Sequelize

- Use `{ underscored: true }` in Sequelize models to follow snake_case convention in the DB
- Always define relationships (associations) clearly in models and match them in migrations

## 8. Git Commits

- Use clear, concise commit messages:
```
feat: add employer-employee relationship
fix: correct typo in employee migration
refactor: simplify user creation logic
```

## 9. Folder Structure

```
/migrations
/seeders
/models
/controllers
/routes
/utils
```

## 10. Other Practices

- Avoid hardcoding values (use config files or env variables)
- Handle all async calls with try/catch
- Write meaningful error messages

---