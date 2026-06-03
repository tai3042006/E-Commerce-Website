# CLOFIT

## Fashion & Sportswear E-Commerce Website

CLOFIT is a modern e-commerce platform specializing in fashion and sportswear products. The project is developed from a mobile-first UI/UX design and transformed into a responsive web application that provides a seamless shopping experience across desktop, tablet, and mobile devices.

The system allows customers to browse products, manage shopping carts, place orders, track purchases, and receive notifications about new products and promotions. The architecture is designed following Object-Oriented Design principles and Design Patterns to ensure maintainability, scalability, and future expansion.

---

## Project Objectives

* Develop a responsive e-commerce website.
* Apply Object-Oriented Analysis and Design (OOAD).
* Implement modern frontend development practices.
* Provide a user-friendly shopping experience.
* Prepare the system for backend integration and database deployment.
* Apply Design Patterns in real-world business scenarios.

---

## Main Features

### Customer Features

#### Authentication

* User Registration
* User Login
* User Logout
* Account Management

#### Product Management

* Browse Products
* Search Products
* View Product Details
* Filter Products by Category
* Product Recommendations

#### Shopping Features

* Add Products to Favorites
* Shopping Cart Management
* Update Product Quantity
* Remove Products from Cart
* Checkout Process
* Order Confirmation

#### Profile Management

* Personal Information
* Account Settings
* Order History
* Order Tracking

#### Notifications

* New Product Notifications
* Promotion Notifications
* Order Status Updates

---

### Administrator Features

* Manage Products
* Manage Categories
* Manage Customer Accounts
* Manage Orders
* View Dashboard Statistics
* Manage Promotions
* Send Notifications to Customers

---

## Applied Design Patterns

### Strategy Pattern

Used to support multiple payment methods.

```text
PaymentStrategy
├── CreditCardPayment
├── CashPayment
└── EWalletPayment
```

Benefits:

* Easy to add new payment methods.
* Follows Open/Closed Principle.
* Reduces code duplication.

---

### Factory Pattern

Used to create payment strategy objects dynamically.

```text
PaymentFactory
└── createPayment(type)
```

Benefits:

* Encapsulates object creation.
* Reduces coupling between components.

---

### Observer Pattern

Used for notification services.

Scenario:

* Admin adds a new product.
* Product Catalog updates.
* Users subscribed to notifications receive updates automatically.

```text
Admin
   ↓
Product Catalog (Subject)
   ↓
notifyObservers()
   ↓
User (Observer)
```

Benefits:

* Loose coupling.
* Real-time notification mechanism.

---

### Singleton Pattern

Used for system configuration management.

```text
SystemConfig
└── getInstance()
```

Benefits:

* Ensures only one configuration instance exists.
* Centralized system settings management.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Vite

### Development Tools

* Git
* GitHub
* VS Code
* Figma
* Postman

---

## Project Structure

```bash
src/
├── assets/          # Images, icons, static resources
├── components/      # Reusable UI components
├── data/            # Mock data
├── hooks/           # Custom React hooks
├── layouts/         # Application layouts
├── pages/           # Application pages
├── routes/          # Route configuration
├── services/        # API services
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── App.tsx
```

---

## Team Members

| Student ID | Full Name             | Responsibility                   |
| ---------- | --------------------- | -------------------------------- |
| 24130270   | Trần Nguyễn Anh Tài   | Team Leader & Frontend Developer |
| 24130366   | Đặng Anh Vĩ           | Database Developer               |
| 19130113   | Trương Huỳnh Anh Kiệt | Frontend Developer               |
| 24130375   | Nguyễn Quý Vinh       | Backend Developer                |
| 24130037   | Nguyễn Công Danh      | UI/UX Designer                   |

---

## Task Distribution

### Trần Nguyễn Anh Tài (Team Leader)

* Project Planning
* Team Coordination
* Frontend Development
* React Components
* Routing System
* Integration & Deployment
* Use Case Diagram

### Đặng Anh Vĩ

* Database Design
* ERD Diagram
* Data Modeling
* Database Integration
* Query Optimization

### Trương Huỳnh Anh Kiệt

* Frontend Development
* Responsive Layout
* UI Components
* State Management
* Frontend Testing
* Documentation Support

### Nguyễn Quý Vinh

* Backend Development
* RESTful API Development
* Authentication & Authorization
* Business Logic Implementation
* Class Diagram
* Sequence Diagram

### Nguyễn Công Danh

* UI/UX Design
* Figma Prototype
* Design System
* User Experience Evaluation
* Interface Design

---

## Installation Guide

### Clone Repository

```bash
git clone https://github.com/tai3042006/E-Commerce-Website.git
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Future Enhancements

### Backend Integration

* RESTful API
* Spring Boot / ExpressJS
* JWT Authentication

### Database

* MySQL
* PostgreSQL

### E-Commerce Features

* Product Management
* Inventory Management
* Order Management
* Customer Management
* Review & Rating System

### Payment Integration

* VNPay
* MoMo
* PayPal
* Stripe

### Analytics & Reporting

* Sales Reports
* Customer Analytics
* Product Performance Statistics

---

## Academic Information

**Course:** Object-Oriented Design / Software Engineering

**Project Type:** Team Project

**Institution:** Nong Lam University (NLU)

**Academic Year:** 2025 - 2026

---

## License

This project is developed for educational and academic purposes only.
