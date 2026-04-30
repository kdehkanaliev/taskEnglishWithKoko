# 📌 Task Management API (Trello-like Backend)

A backend API for managing **Workspaces, Boards, and Tasks** with authentication, role-based access control, and Swagger documentation.

---

## 📦 Installation

frist of all you need to create own env file and copy elements from env.example to your own env and set values to your env

you can see all swaggers on localhost:{Your Port}/docs also i upload postman collection file on task.postman_collection.json

```bash
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
npm install
node server.js

## 🚀 Features

- 🔐 Authentication (Register, Login, Refresh Token)
- 🏢 Workspace management (create, invite users, roles)
- 📋 Boards inside workspace
- ✅ Tasks inside boards (create, move, reorder)
- 👮 Role-based access control (owner, admin, member)
- 📄 Swagger API documentation
- 🧪 Ready for testing (unit, integration, e2e)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Swagger (swagger-ui-express + swagger-jsdoc)
- dotenv

---

