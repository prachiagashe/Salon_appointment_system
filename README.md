# SalonEase - Salon Appointment Management System

A comprehensive salon appointment management system built with React.js, FastAPI, and MySQL.

## Features

### Customer Features
- User registration and authentication
- Browse salon services and staff profiles
- Book appointments with real-time availability
- View and manage appointment history
- Cancel or reschedule appointments
- Personal profile management

### Admin Features
- Secure admin dashboard
- Manage salon services (CRUD operations)
- Manage staff members
- View and manage customers
- Appointment management (approve, complete, cancel)
- Dashboard analytics and reports
- Revenue tracking

## Technology Stack

### Frontend
- React.js with Vite
- React Router DOM
- Axios for API integration
- Lucide React icons
- Responsive CSS

### Backend
- Python FastAPI
- SQLAlchemy ORM
- Pydantic validation
- JWT authentication
- Password hashing with bcrypt

### Database
- MySQL

## Project Structure

```
SalonEase/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── crud/
│   │   ├── core/
│   │   ├── main.py
│   │   └── database.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials.

6. Run the backend server:
```bash
uvicorn app.main:app --reload
```

Backend will run on: http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE salonease;
```

2. Update database credentials in `backend/.env`

3. Tables will be created automatically on first run using SQLAlchemy

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default Admin Credentials

After first run, you can create an admin account through the registration endpoint with admin role.

## License

This project is licensed under the MIT License.
