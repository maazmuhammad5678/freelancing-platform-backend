# Freelancing Platform Backend API

A backend API for a freelancing platform designed to connect clients with freelancers. The platform provides the foundation for managing projects, freelancer proposals, user accounts, and authentication.

## 🚀 Live Deployment

**Production URL:**  
https://freelancing-platform-backend.vercel.app

**Hosting:** Vercel  
**Branch:** main  
**Deployment Status:** Ready

## 📌 Project Overview

The Freelancing Platform Backend is designed to handle the core backend operations of a freelancing marketplace.

It aims to support two main user roles:

- **Client:** Can create projects and receive proposals.
- **Freelancer:** Can browse projects and submit proposals.

## 🛠️ Technologies

> Confirm the exact dependencies against package.json.

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- REST API
- Vercel

## ✨ Main Functional Areas

- User Registration
- User Login and Authentication
- Role-Based User Access
- Client and Freelancer Accounts
- Project Management
- Freelancer Proposals
- Protected API Routes

## 🌐 API Base URL

```text
https://freelancing-platform-backend.vercel.app
```

## 📡 API Endpoints

The following endpoint paths were used in the proposed Postman testing workflow. Verify them against the actual Express routes before treating this list as final.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Root route |
| POST | `/api/user/signup` | User registration |
| POST | `/api/user/login` | User login |
| GET | `/api/user/profile` | Get user profile |
| GET | `/api/projects` | Get projects |
| POST | `/api/projects` | Create project |
| POST | `/api/projects/:projectId/proposal` | Submit proposal |

## 🔐 Authentication

The API is intended to use JWT-based authentication for protected routes.

For authenticated requests, use:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 API Testing

API testing can be performed using Postman.

Testing workflow:

1. Register a freelancer account.
2. Register a client account.
3. Login and obtain JWT tokens.
4. Retrieve user profiles.
5. Create a project as a client.
6. Submit a proposal as a freelancer.

## ⚙️ Installation and Setup

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd freelancing-platform-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory and configure the environment variables according to your application:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the development server:

```bash
npm run dev
```

Or, if your project uses a start script:

```bash
npm start
```

## ☁️ Deployment

The backend is deployed on Vercel.

Production URL:

https://freelancing-platform-backend.vercel.app

## 👨‍💻 Developer

**Muhammad Maaz Bin Aamir**

BS Computer Science Student  
Backend Development | Node.js | Express.js | MongoDB

## 📄 License

This project is developed for educational and learning purposes.
