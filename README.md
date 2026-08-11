# 🚀 Full-Stack CRM Application

Welcome to the **Full-Stack CRM Application**! This project is a comprehensive Customer Relationship Management (CRM) tool built with the MERN stack (MongoDB, Express, React, Node.js). It provides a robust set of features to help you manage deals, contacts, companies, and support tickets efficiently.

## ✨ Key Features

### 💼 Deal Management (Kanban Board)
- Visual drag-and-drop Kanban board to track deals across different stages.
- Detailed modal views for deals to manage notes, assignees, and company associations.

### 👥 Contact & Company Directory
- Maintain a centralized directory of all your contacts and companies.
- Search and filter functionality to quickly find the information you need.

### 🎫 Support Ticketing System
- Integrated ticketing system for tracking customer support requests.
- Manage ticket statuses and assignments to ensure timely resolution.

### 🔒 Secure Authentication
- Full user authentication using JSON Web Tokens (JWT) and `bcrypt` for password hashing.
- Role-based access control (Admin vs. User).

## 🛠️ Technology Stack

**Frontend (`CRMFrontend`)**
- **React.js** (via Vite for blazing-fast development)
- **React Router** for seamless navigation
- **Recharts** for interactive data visualization
- **Axios** for API communication

**Backend (`CRMBackend`)**
- **Node.js & Express.js** for the RESTful API
- **MongoDB & Mongoose** for data persistence and modeling
- **Agenda** for background job processing
- **JWT** for secure user sessions

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/praketmehta/CRM.git
cd CRM
```

### 2. Backend Setup
```bash
cd CRMBackend
npm install
```
Create a `.env` file in the `CRMBackend` directory and add your environment variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```
Start the backend server:
```bash
npm run dev
# or
node app.js
```

### 3. Frontend Setup
```bash
cd ../CRMFrontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

Your CRM should now be running! The frontend will typically be accessible at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/praketmehta/CRM/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
