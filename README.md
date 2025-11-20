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

🔹 Signup Page
<img width="901" height="700" alt="Screenshot 2025-11-18 205605" src="https://github.com/user-attachments/assets/9e1409cb-9745-4bda-90fa-4f3d76d9d3cd" />


🔹 Login Page
<img width="1301" height="840" alt="Screenshot 2025-11-18 205544" src="https://github.com/user-attachments/assets/5f4bd0a3-cfb2-4478-a314-2a40e7b246f0" />


🔹 Forgot Password Popup
<img width="662" height="461" alt="Screenshot 2025-11-18 205557" src="https://github.com/user-attachments/assets/5d6b3bbb-9881-40f0-9ddd-4b1ed06ca6b8" />


🔹 Employee Dashboard
<img width="1919" height="1079" alt="Screenshot 2025-11-18 205121" src="https://github.com/user-attachments/assets/af291c4a-acb2-4eca-89e1-d30ef9e248eb" />


🔹 Apply for Leave + Leave Balance
<img width="1919" height="1079" alt="Screenshot 2025-11-18 205245" src="https://github.com/user-attachments/assets/c648f1ca-ebbd-437d-8faa-5af0dd98058f" />


🔹 Leave History – With Status (Approved/Rejected/Cancelled)
<img width="1916" height="969" alt="Screenshot 2025-11-18 202801" src="https://github.com/user-attachments/assets/d0bf6894-cc2b-4999-b646-4d29a7836589" />


🔹 Admin Panel – Approval & Rejection
<img width="1919" height="1079" alt="Screenshot 2025-11-18 205135" src="https://github.com/user-attachments/assets/347ec5ce-29c1-4b11-8432-c55f668f3ab7" />


🔹 Admin Rejection Popup
<img width="1919" height="1079" alt="Screenshot 2025-11-18 205400" src="https://github.com/user-attachments/assets/ec51eef7-bf30-4696-850f-21d4fd26b6da" />


🔹 Updated Admin View After Action
<img width="1919" height="692" alt="Screenshot 2025-11-18 205305" src="https://github.com/user-attachments/assets/526abe06-0eb5-41bc-9a64-2c08da103c33" />


🔹 more Leaves cannot be applied when he have low leaves than applied
<img width="1910" height="695" alt="Screenshot 2025-11-18 205532" src="https://github.com/user-attachments/assets/3ee88cf3-8548-431b-9767-5d0dc8ff6d7e" />


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

📁 Project Folder Structure
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

📘 What Each Folder Contains
components/
Reusable UI components such as cards, forms, tables, and logout button.

pages/
Full pages that appear in routes:
Login
Signup
Dashboard (User)
Admin Panel

services/
Handles all business logic such as:
Applying leave
Updating leave status
Cancelling leave
Saving & loading from localStorage

utils/
Small helper functions like date formatting.

⭐ Features
🔐 Authentication
JWT-based login
Admin & User roles
Middleware-protected routes

📝 Leave Management
Apply leave
Prevent overlapping leave
Cancel leave (user)
Approve / Reject leave (admin)
Remarks & timestamps

⚙️ System
Auto session handling (30 min expiry)
Clean data models (User & Leave)
Secure password hashing (bcrypt)

🛠 Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT (jsonwebtoken)
bcryptjs
dotenv

backend/
 ├── config/
 │   └── db.js
 ├── controllers/
 │   ├── authController.js
 │   └── leaveController.js
 ├── middleware/
 │   └── authMiddleware.js
 ├── models/
 │   ├── User.js
 │   └── Leave.js
 ├── routes/
 │   ├── authRoutes.js
 │   └── leaveRoutes.js
 ├── server.js
 ├── package.json

📥 Installation
cd backend
npm install

▶️ Running the Server
Development mode:
npm run dev

Or normal:
node server.js

Server runs at:
http://localhost:5000

🔗 API Routes Overview
Auth Routes (/api/auth)
Method	 Endpoint	 Description
POST	 /signup	     Register a new user
POST	 /login	     Login & get JWT

Leave Routes (/api/leaves)
Method 	  Endpoint	        Description
POST	  /apply	       Apply for leave
GET	      /my	           Get user's leaves
GET	     /all	           Admin: view all leaves
PUT	     /status/:id	   Admin: approve/reject
PUT	    /cancel/:id        User: cancel leave

🔐 Security Practices
JWT authentication on protected routes
Password hashing using bcrypt
Role-based access (admin/user)
Input validation (manual + model layer)

🚫 Error Handling
All controllers wrapped in try-catch
Consistent API response format
Meaningful error messages
Token expiration handling

📈 Future Enhancements
Email notifications
OTP-based password reset
Admin dashboard reports
Role-based user management
Leave type categories
