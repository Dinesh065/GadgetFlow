# 📱 GadgetFlow - Smart Rental System

GadgetFlow is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to streamline the process of renting electronic gadgets. It provides two dedicated panels for **Buyers** and **Sellers**, with intuitive flows for listing, requesting, tracking, paying, and returning items.

---

## 🔗 Live Demo

**🚀https://gadget-flow-fjo9.vercel.app/**

---

## 🖼️ Project Preview

 ![LandingPage](https://github.com/user-attachments/assets/21ee16ce-fe7a-42bf-aa9c-64f180dd135a)

---

## 🧠 Overview

GadgetFlow enables a seamless rental experience through a dual-panel system:

- 👤 **Buyer Panel** – Allows users to browse gadgets, request rentals, track orders, make payments, and manage wishlists.
- 🧑‍💼 **Seller Panel** – Provides tools for listing items, managing rentals, tracking delivery/return acknowledgements, and monitoring earnings.

---

## 📦 Features

### ✅ Core Functionality

- Dual panel: Separate flows for Buyer and Seller
- Seller uploads gadgets for rent
- Buyer requests and makes payments via **Stripe**
- Seller accepts a request (auto-rejects others)
- Email-based 2-way delivery/return acknowledgements using **Nodemailer**
- Rental calendar for tracking item status
- Image upload using **Multer + Cloudinary**
- Profile management for both roles
- Responsive UI powered by **Tailwind CSS**
- Real-time status updates

---

### 📧 Email Triggers

- Rental request acceptance
- Delivery/pickup acknowledgment
- Return acknowledgment
- Payment confirmation

---

## 🛠️ Tech Stack

| Tech          | Usage                              |
|---------------|-------------------------------------|
| MongoDB       | Database for storing user/item data |
| Express.js    | Backend routing and logic           |
| React.js      | Frontend user interface             |
| Node.js       | Backend runtime environment         |
| Stripe        | Payment gateway                     |
| Nodemailer    | Email notifications                 |
| Cloudinary    | Image hosting                       |
| Multer        | File upload                         |
| Tailwind CSS  | Responsive styling                  |
| JWT / Cookies | Authentication                      |

---

## 📂 Folder Structure
GadgetFlow/
- │
- ├── client/ # React frontend
- │ ├── src/
- │ │ ├── components/
- │ │ ├── pages/
- │ │ └── ...
- │
- ├── server/ # Node.js backend
- │ ├── controllers/
- │ ├── models/
- │ ├── routes/
- │ ├── utils/
- │ └── ...

---


---

## 🚀 Getting Started

### 🧳 Prerequisites

- Node.js
- MongoDB Atlas or local MongoDB
- Cloudinary account
- Stripe account
- Nodemailer-compatible email (Gmail or other SMTP)
- Git

---

### ⚙️ Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GadgetFlow.git
cd GadgetFlow
```

#### 2. Backend Setup

```bash
cd server
npm install
```

#### 2.1 Create a .env file with the following keys:

```bash
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

#### 2.2 Start the server:

```bash
npm run dev
```

#### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

### 🔐 Authentication

-JWT-based authentication with secure cookies for protected routes. Separate auth flows for Buyer and Seller.

---

### ✨ Future Enhancements

- Admin Panel for platform monitoring
- Real-time chat between buyer and seller
- Mobile PWA version
- Advanced filtering and search
- Ratings and Reviews

---

### 📸 Screenshots

 ![LandingPage](https://github.com/user-attachments/assets/21ee16ce-fe7a-42bf-aa9c-64f180dd135a)
 ![LandingPage](https://github.com/user-attachments/assets/bd5fef5d-40a1-4058-a2c4-68418210857d)
 ![LandingPage](https://github.com/user-attachments/assets/f45e0656-2c78-4473-8f99-52ad60c61305)
 ![LandingPage](https://github.com/user-attachments/assets/e6dc4fdd-f101-41b9-a8d5-7f30a96e01ae)

 ![LandingPage](https://github.com/user-attachments/assets/9da35dc0-88e2-4ffa-9567-09259fdbb06d)
 ![LandingPage](https://github.com/user-attachments/assets/b115d600-e8cb-4a34-8865-fcd77d56e76f)
 ![LandingPage](https://github.com/user-attachments/assets/f89f7c9f-a001-4ba9-bcdc-8bab0c52bd2c)

 ---

 ### 🙌 Contributing

 - Feel free to fork the project, raise issues, and open pull requests!

---

## 📫 Contact Me

Let's connect and collaborate!  
- **LinkedIn:** [https://www.linkedin.com/in/dinesh-choudhary-4aa2082aa/]
- **Email:** dc9359349132@gmail.com
- **Twitter:** [https://x.com/DineshChou90368]

---
