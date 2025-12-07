# StudyBuddy 2.0  
A full-stack task and subject management application built using **Vue 3**, **BootstrapVue**, **Chart.js**, **TypeORM**, **Express**, and **JWT authentication**.

This project was developed as the final assignment for **CWEB 280**, extending the midterm project with a full UI, CRUD operations, charts, authentication, and a complete frontend–backend integration.

---
# Group Members
Meetkumar Patel

Karmkumar Patel

Smit Parmar

---
## 📌 Features

### 🔐 Authentication
- Register new users
- Login with JWT-based authentication
- “Remember me” optional persistent login
- Logout functionality
- Route protection via navigation guards

---

### 📚 Subjects Management (CRUD)
- Add, edit, delete subjects
- Choose simple color names (blue, orange, etc.)
- Subject list table with colored marker
- Validation & error handling

---

### 📝 Tasks Management (CRUD)
- Add tasks with:
  - Title
  - Description
  - Subject assignment
  - Priority level
  - Due date
  - Status (pending/done)
- Edit and delete tasks
- Automatic filtering & dropdowns populated from backend

---

### 📊 Dashboard with Charts (Chart.js)
Three charts visualize the user's academic progress:
1. **Tasks per Subject** (Bar Chart)  
2. **Completion Status** (Pending vs Done – Doughnut Chart)  
3. **Upcoming Deadlines** (Line Chart)

Also displays:
- Total tasks
- Completed tasks
- Completion percentage

---

### 👤 Profile Page
- Displays user information
- Placeholder area available for future settings

---

## 🏗️ Tech Stack

### Frontend
- Vue 3 (Vite)
- Vue Router
- BootstrapVue 3
- Axios
- Vue Toastification
- Chart.js + vue-chartjs

### Backend
- Node.js + Express
- TypeORM + SQLite
- JWT Authentication
- Bcrypt password hashing
- Class-validator

---
