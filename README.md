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
- **Next.js** (v15.2.1)
  
To check your versions:

```bash
node -v      # v22.13.0
nest -v      # v11.0.5
npm view next version  # v15.2.1
mysql --version  # v8.0.41
