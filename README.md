# 🏦 Banking Management System

A full-stack Banking Management System that demonstrates how modern online banking operations work. The application provides secure authentication, account management, financial transactions, double-entry ledger accounting, and a responsive user interface.

Built with React, Node.js, Express, and MongoDB, this project focuses on backend engineering concepts, secure financial transaction processing, and modern web application development.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only cookies for secure token storage.
- Session persistence and protected routes.

### 💳 Account Management
- Create and link bank accounts.
- View real-time account balances.
- Monitor account statuses.
- Manage multiple banking accounts.

### 💰 Transactions & Ledger
- Deposit funds into bank accounts.
- Withdraw funds from accounts.
- Transfer money between accounts.
- Double-entry ledger records for financial consistency.
- Transaction history and status tracking.

### 📧 Email Notifications
- Automated email notifications using Nodemailer.
- Transaction-related alerts.
- Account activity notifications.

### 📊 Interactive Dashboard
- Modern and responsive dashboard.
- Account balance overview.
- Recent transaction activity.
- Balance breakdown.
- Quick-action cards for banking operations.

### 📖 API Documentation
- Interactive API documentation using Swagger UI.
- OpenAPI documentation for backend endpoints.
- Test API requests directly through the browser.
- Available at `/api-docs`.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI development |
| [Vite](https://vitejs.dev/) | Frontend build tool |
| [React Router DOM v7](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | UI styling |
| Custom CSS | Additional styling |
| [Lucide React](https://lucide.dev/) | Icons |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js v5](https://expressjs.com/) | Backend framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| [JSON Web Token](https://jwt.io/) | Authentication |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing |
| [Nodemailer](https://nodemailer.com/) | Email notifications |
| Swagger UI | API documentation |
| swagger-jsdoc | OpenAPI specification generation |

---

## 🏗️ System Architecture

The application follows a client-server architecture in which the React frontend communicates with the Express backend through RESTful APIs.

```text
              CLIENT SIDE
          React 19 + Vite
                 |
                 |
           HTTP Requests
                 |
                 v
             BACKEND
          Node.js + Express
                 |
        ---------------------
        |         |         |
     Routes  Middleware  Controllers
                           |
                           v
                       Services
                           |
                           v
                       Mongoose
                           |
                           v
                        MongoDB
                           |
                  ----------------
                  |              |
                Users         Accounts
                                 |
                            Transactions
                                 |
                              Ledger
```

---

## 📂 Project Structure

```text
Banking Management System/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── Database & Swagger configuration
│   │   │
│   │   ├── controllers/
│   │   │   └── Authentication, Account & Transaction logic
│   │   │
│   │   ├── middlewares/
│   │   │   └── Authentication & request validation
│   │   │
│   │   ├── models/
│   │   │   └── User, Account, Ledger & Transaction schemas
│   │   │
│   │   ├── routes/
│   │   │   └── API route definitions
│   │   │
│   │   ├── services/
│   │   │   └── Nodemailer & helper services
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
├── NEW_FRONTEND/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or Yarn
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd "Banking Management System"
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Install the dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `Backend` directory.

Configure the following environment variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/banking_db

# Authentication
JWT_SECRET=your_secure_jwt_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Important:** Replace the placeholder values with your actual credentials. Never upload your `.env` file or expose your secrets on GitHub.

### 4. Start the Backend Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend server will run at:

`http://localhost:3000`

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory from the project root:

```bash
cd NEW_FRONTEND
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be accessible at:

`http://localhost:5173`

---

## 📖 API Documentation

This project provides interactive API documentation through Swagger UI.

To access the documentation:

1. Start the backend server.
2. Open your browser.
3. Navigate to:

**http://localhost:3000/api-docs**

Swagger UI allows you to:

- Explore available API endpoints.
- Inspect request parameters and response schemas.
- Understand API operations.
- Execute and test API requests directly from the browser.

---

## 🗄️ Database Design

The application uses MongoDB with Mongoose for database management.

The primary data models include:

| Model | Responsibility |
|---|---|
| User | Stores user information and authentication credentials |
| Account | Manages bank accounts and account balances |
| Transaction | Stores transaction details and processing status |
| Ledger | Maintains debit and credit entries for financial operations |

### Double-Entry Ledger Accounting

The system implements a double-entry ledger approach to maintain financial consistency.

Every financial transaction is represented through corresponding debit and credit entries.

For example, when transferring NPR 1,000 from Account A to Account B:

| Account | Entry Type | Amount |
|---|---|---:|
| Account A | DEBIT | NPR 1,000 |
| Account B | CREDIT | NPR 1,000 |

The total debit and credit amounts should remain balanced.

This approach provides a foundation for transaction auditing and financial record consistency.

---

## 🔒 Security Considerations

Security is an important aspect of banking applications.

The project incorporates the following security mechanisms:

- **Password Hashing:** bcrypt is used to securely hash user passwords.
- **JWT Authentication:** JSON Web Tokens are used to authenticate users.
- **HTTP-only Cookies:** Authentication tokens are stored in HTTP-only cookies.
- **Protected Routes:** Middleware restricts access to authenticated resources.
- **Environment Variables:** Sensitive credentials are separated from application source code.
- **Transaction Consistency:** Ledger entries and database transactions help maintain financial integrity.

---

## 🔮 Future Improvements

Potential enhancements for the project include:

- Two-factor authentication (2FA).
- Advanced transaction filtering and search.
- Downloadable account statements.
- Admin dashboard and user management.
- Transaction audit logs.
- Rate limiting and enhanced API security.
- Automated unit and integration testing.
- Fraud detection and suspicious transaction monitoring.

---

## 👨‍💻 Author

**Anjal Poudel**

- GitHub: [PrincePoudel-Anjal](https://github.com/PrincePoudel-Anjal)

---

## 📌 Disclaimer

This project is developed for educational purposes to demonstrate full-stack development, backend engineering, database management, authentication, and financial transaction processing.

It is not intended for handling real-world financial transactions or production banking operations.

---

⭐ If you find this project interesting, consider giving the repository a star!