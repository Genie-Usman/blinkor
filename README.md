
# 🛍️ Blinkor - Drip.Blink.Style

**Blinkor** is a modern full-stack e-commerce web application that allows users to browse products, add them to a cart, and securely checkout using Stripe integration.

---

## 🔗 Live Demo

[Visit Blinkor Live](https://blinkor.vercel.app/)

---

## ✨ Features

- 🛒 Product browsing and filter
- 🧺 Shopping cart functionality
- 💳 Stripe payment integration
- 🔐 Authentication (Login/Signup)
- 📦 Order summary and checkout flow
- 📱 Responsive UI with modern design

---

## 🛠️ Tech Stack

### Frontend:
- Next.js (App Router)
- Tailwind CSS
- React.js
- Stripe.js (payment UI)

### Backend:
- Node.js
- MongoDB + Mongoose
- Stripe API

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Genie-Usman/blinkor.git
cd blinkor
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Setup environment variables
Create a .env.local file in the root directory and add:

```bash
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_SERVER_URL=your_server_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_key
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_nodemailer_email
EMAIL_PASS=your_nodemailer_email_password
```

### 4. Run the development server

```bash
yarn dev
```

**Made with ❤ by [@Genie-Usman](https://github.com/Genie-Usman)**
