# Alshafique Public School Kamber - School Management System

A complete, modern, professional School Management System web application.

## Features

- **Secure Role-based Login**: Admin, Principal, Teacher, Accountant, Student, Parent
- **Admin Dashboard** with stats, charts, recent activities & announcements
- **Student Management**: Full CRUD, search, filter, profiles
- **Teacher & Staff Management**
- **Classes & Sections** (Nursery to Grade 10)
- **Attendance System**: Present / Absent / Late / Leave + history
- **Fee Management**: Collect fees, pending tracking, printable receipts
- **Exams & Results**: Marks, grades, percentage, printable report cards
- **Timetable** for classes/sections
- **Notices & Announcements**
- **Homework** assignment & viewing
- **Reports**: Student list, fees, attendance, results, class-wise (printable)
- **Parent & Student Portal** (own data only)
- **Teacher Portal** (mark attendance, view classes, homework)
- **Admin Settings**
- Fully responsive (Desktop / Tablet / Mobile)
- Professional blue & white theme
- Realistic demo data included

## How to Run

Open `index.html` in any modern browser, **or** serve it:

```bash
cd alshafique-sms
python3 -m http.server 8080
# then open http://localhost:8080
```

## Demo Credentials

| Role       | Username   | Password     |
|------------|------------|--------------|
| Admin      | admin      | admin123     |
| Principal  | principal  | principal123 |
| Teacher    | teacher1   | teacher123   |
| Accountant | accountant | account123   |
| Student    | student1   | student123   |
| Parent     | parent1    | parent123    |

Click any demo credential button on the login page to auto-fill.

## Technical Notes

- Pure client-side SPA (HTML + Tailwind CSS + Vanilla JS + Chart.js)
- Data persists in browser `localStorage`
- No backend required for demo
- All CRUD operations work
- Printable receipts & report cards

© 2026 Alshafique Public School Kamber
