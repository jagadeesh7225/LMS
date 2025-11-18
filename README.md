📘 Leave Management System (LMS)

This is a simple Leave Management System built using React + LocalStorage.
It allows employees to apply for leave, view leave history, and lets the admin approve or reject leave requests.

The whole project runs completely on the browser with no backend required.

✨ Features
👤 User Features

Signup & Login

Apply for leave with date range

Check remaining leave balance

Prevents overlapping leave dates

Shows total leave days before submitting

View leave history

Cancel pending leave requests

Auto logout after 30 minutes

🛠️ Admin Features

View all leave requests

Approve or reject requests

Add remarks when rejecting

Updates reflect instantly across pages

Auto logout after 30 minutes

📸 Screenshots
🔹 Signup Page

🔹 Login Page

🔹 Forgot Password Popup

🔹 Employee Dashboard

🔹 Apply for Leave + Leave Balance

🔹 Leave History – With Status (Approved/Rejected/Cancelled)

🔹 Admin Panel – Approval & Rejection

🔹 Admin Rejection Popup

🔹 Updated Admin View After Action

🚀 How to Run the Project

Clone or download the project

Install dependencies

npm install


Start the React app

npm run dev


Open in browser:

http://localhost:5173/

📂 Default Admin Credentials
Role	Email	Password
Admin	admin@lms.com
	Admin@123
🔐 Session Timeout

Both Admin and User are automatically logged out after 30 minutes of activity.

📝 Notes

All data is stored in localStorage (no backend).

Leave balance updates only when a leave is approved.

Cancelled leaves remain in history with proper status and remark.

lms/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── styles.css
│   │
│   ├── components/
│   │   ├── DashboardCard.jsx
│   │   ├── LeaveForm.jsx
│   │   ├── LeaveHistory.jsx
│   │   └── LogoutButton.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Dashboard.jsx
│   │   └── AdminPage.jsx
│   │
│   ├── services/
│   │   └── leaveService.js
│   │
│   ├── utils/
│   │   └── DateUtils.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
