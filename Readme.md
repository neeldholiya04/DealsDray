# Employee Management System

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Employee Management System is a full-stack web application designed to help organizations manage their employee data efficiently. It provides features for user authentication, employee registration, and employee data management.

## Features

- User authentication (login/logout)
- Employee registration
- View all employees
- Edit employee information
- Delete employee records
- Search functionality for employees
- Responsive design for various screen sizes

## Technologies Used

### Frontend

- React.js
- Ant Design (UI library)
- Axios (for API calls)
- React Router (for navigation)

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose ORM)
- JSON Web Tokens (JWT) for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/neeldholiya04/DealsDray.git
   cd DealsDray
   ```

2. Install dependencies for both frontend and backend:

   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `server` directory
   - Add the following variables:
     `     ACCESS_TOKEN_SECRET=youraccesstokensecret
            REFRESH_TOKEN_SECRET=yourrefreshtokensecret
            PORT: 3001
            MONGO_URL=Your MongoURL
    `

4. Start the backend server:

   ```
   cd server
   npm start
   ```

5. Start the frontend development server:

   ```
   cd client
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
DealsDray/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── client/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── calls/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Usage

1. Log in to the system using your credentials.
2. Use the navigation menu to access different features:
   - Home: Dashboard with summary information
   - Create Employee: Add a new employee to the system
   - All Employees: View, edit, or delete employee records

## API Endpoints

- POST `/api/users/register`: Register a new user
- POST `/api/users/login`: Authenticate a user
- GET `/api/users/employees`: Get all employees
- DELETE `/api/users/employees/:id`: Delete an employee
- PUT `/api/users/employee/:id`: Update an employee's information

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Upon successful login, a token is generated and stored in the browser's local storage. This token is included in the headers of subsequent API requests for authentication.

## Error Handling

The application implements comprehensive error handling:

- Frontend: Displays user-friendly error messages using Ant Design's message component.
- Backend: Returns appropriate HTTP status codes and error messages.

