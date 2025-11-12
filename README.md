🌾 AgriLink – Smart Agricultural Marketplace

**AgriLink** is an end-to-end agricultural marketplace web app that connects **farmers directly with buyers**.
It allows farmers to **add their crops/products**, and buyers to **view and purchase them** through a secure and easy-to-use platform.

---

## 🚀 Features

* 👨‍🌾 **Farmer Dashboard** — Add, view, and manage your products.
* 🧑‍💼 **Buyer Marketplace** — Browse available crops and place orders.
* 💬 **AI Chatbot** — Provides agricultural advice and answers crop-related queries.
* 🔐 **User Authentication** — Secure login and registration for Farmers and Buyers.
* 🧾 **Order Management** — Buyers can place orders, and farmers can track them.

---

## 🏗️ Project Structure

```
AgriLink/
│
├── backend/              # Node.js + Express + MongoDB API
│   ├── models/           # Mongoose models (User, Product, Order)
│   ├── routes/           # API routes (users, products, orders)
│   ├── server.js         # App entry point
│   └── .env              # Environment variables (Mongo URI, JWT secret)
│
└── frontend/             # HTML, CSS, JS frontend
    ├── index.html        # Landing page
    ├── login.html        # Login page
    ├── register.html     # Registration page
    ├── marketplace.html  # Buyer marketplace
    ├── dashboard.html    # Farmer dashboard
    ├── orders.html       # Buyer orders page
    └── chatbot/          # Chatbot files (index.html, script.js)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/agrilink.git
cd agrilink
```

### 2️⃣ Install backend dependencies

```bash
cd backend
npm install
```

### 3️⃣ Configure environment

Create a `.env` file inside the `backend/` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the backend server

```bash
npm start
```

You should see:

```
✅ Server running on port 5000
✅ MongoDB connected
```

### 5️⃣ Open the frontend

Open the `frontend/` folder in VS Code and run **Live Server**
(Default URL → `http://127.0.0.1:5500/frontend/`)

---

## 🧑‍💻 User Roles

| Role       | Access                                                     |
| ---------- | ---------------------------------------------------------- |
| **Farmer** | Can add, view, and manage their products via **Dashboard** |
| **Buyer**  | Can browse marketplace and place orders                    |

---

## 🧾 API Routes Overview

| Route                 | Method | Description                    |
| --------------------- | ------ | ------------------------------ |
| `/api/users/register` | POST   | Register new user              |
| `/api/users/login`    | POST   | Login user and get token       |
| `/api/products`       | POST   | Add new product (Farmer only)  |
| `/api/products`       | GET    | Get all products (Marketplace) |
| `/api/orders/place`   | POST   | Place order (Buyer only)       |

---

## 🧠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Token)

---
---

## 🏁 Future Improvements

* Add payment gateway integration 💳
* Add notification system 📱
* Mobile app version 📱
* AI recommendations for crop pricing 🌱

