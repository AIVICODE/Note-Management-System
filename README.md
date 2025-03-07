
This is a note management application built using **NestJS** for the backend and **Next.js** for the frontend. Users can register, log in, create, edit, and delete notes. Categories can be assigned to notes, and filtering by categories was planned but not implemented due to time constraints.

## Development Setup Instructions

### Prerequisites

Make sure you have the following installed:

# Note-Management-System
This is a **Note Management System** built using **NestJS** for the backend and **Next.js**.


# Note Management System

## Project Overview

This is a **Note Management System** built using **NestJS** for the backend and **Next.js** for the frontend. The application allows users to register, log in, create, edit, and delete notes, as well as manage categories. It supports basic CRUD operations for notes and categories, though some features (like category filtering) were not fully implemented due to time constraints.

## Key Features

- **User Authentication**: Users can register, log in, and manage their notes securely.
- **Notes Management**: Users can create, edit, delete, and archive notes.
- **Category Assignment**: Notes can be assigned categories, and categories can be managed.
- **Session Management**: Sessions are managed using secure, hashed passwords for authentication.
- **Database Integration**: MySQL is used for storing user and note data.

### Technologies Used

- **Backend:**
  - **NestJS**: A progressive Node.js framework for building efficient, scalable server-side applications.
  - **TypeORM**: An Object-Relational Mapper (ORM) that allows seamless integration with MySQL.
  - **bcrypt**: A library to securely hash passwords.
  - **MySQL**: Relational database management system used to persist data.
  - **express-session**: Used for managing user sessions and ensuring secure authentication.

- **Frontend:**
  - **Next.js**: A React-based framework for building modern web applications with server-side rendering.
  - **CSS/HTML**: Basic styling for the frontend interface.

### Features Not Fully Implemented

- **Category Filtering**: The feature to filter notes by category was planned but not implemented due to time constraints.
- **Category Assignment Bug**: Currently, categories can only be assigned when editing a note, not during creation.
- **Frontend Aesthetics**: While the frontend is functional, I focused more on backend architecture and practices, which led to less attention on frontend aesthetics.

## Setup and Installation

### Prerequisites

Ensure that you have the following installed:


- **Node.js** (v22.13.0)
- **NestJS** (v11.0.5)
- **MySQL** (v8.0.41)

- **NPM** (For installing dependencies)
- **Next.js** (v15.2.1)

To check your versions, run the following commands:

bash-->
node -v      # Should be v22.13.0
nest -v      # Should be v11.0.5
npm view next version  # Should be v15.2.1
mysql --version  # Should be v8.0.41
Setup Instructions
1. Clone the repository
Start by cloning this repository to your local machine:

bash-->
git clone https://github.com/hirelens-challenges/DosSantos-264ede.git
cd DosSantos-264ede
2. Backend Setup (NestJS)
Install dependencies in the backend folder:
bash-->
cd backend
npm install
Set up environment variables:
Create a .env file in the backend folder with the following environment variables:

bash-->
SESSION_PW="123"  # Example, replace with a strong password for session encryption
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="your_mysql_password"
DB_NAME="notes_db"
Run the backend server:
bash-->
npm run start
The backend will start on http://localhost:3000.

3. Frontend Setup (Next.js)
Install dependencies in the frontend folder:
bash-->

cd ../frontend
npm install
Run the frontend server:
bash-->

npm run dev
The frontend will start on http://localhost:3001.



- **Next.js** (v15.2.1)
  
To check your versions:

```bash
node -v      # v22.13.0
nest -v      # v11.0.5
npm view next version  # v15.2.1
mysql --version  # v8.0.41
