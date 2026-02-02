# Exam Attendance Management System – Backend

## Overview
It provides role-based access for Admins and Teachers to ensure secure and organized exam attendance tracking.

---

## Roles & Responsibilities

### Admin
- Create and manage exams
- Create rooms for exams
- Assign teachers to rooms
- Assign students to exam rooms
- Download form A

### 👩‍🏫 Teacher
- View only the rooms assigned to them
- View students allotted to their rooms
- Mark student attendance (Present / Absent)

---

---
## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Local – MongoDB Compass)
- Mongoose
- dotenv
- nodemon

## ⚙️ Setup Instructions (MongoDB Compass – Local)

## Install Dependencies
```bash
npm install
```
## Install MongoDB (Local)
- Install MongoDB Community Server
- Install MongoDB Compass

## Connect Using MongoDB Compass
Connection URI:
mongodb://localhost:27017
Click Connect

## Create Database & Collections
Database Name:
attendanceDB

## Collections:
- users
- students
- rooms
- exams
- attendances

## Run Server
```bash
npm start
```

## 👩‍🏫 Teacher APIs

Fetch Allotted Rooms  
GET /attendance/teacher/:teacherId/rooms

---

Mark Attendance  
POST /attendance/mark

Request Body:
{
  "roomId": "",
  "examId": "",
  "markedBy": "",
  "attendance": [
    { "studentId": "", "status": "present" },
    { "studentId": "", "status": "absent" }
  ]
}

---

View Room Attendance  
GET /attendance/room/:roomId

