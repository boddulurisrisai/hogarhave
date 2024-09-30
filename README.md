# HogarHaven E-commerce Application

An online retailer application developed using **React**. This application allows customers to browse smart home products, create accounts, place orders, and track them, while also offering specific roles and functionality for store managers and salesmen.

## Project Overview

This project aims to create a seamless shopping experience for SmartHomes customers, where they can place orders, manage accounts, and track order status, while managers and salesmen handle the backend operations.


## How to Run the Application

To start and run the application locally:

1. Clone the repository to your local machine.

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies using:

    ```bash
    npm install
    ```

3. Run the application:

    ```bash
    npm start
    ```

4. The application will be hosted at `http://localhost:3000`.

## Features and Functionalities

### Customer Features

## Features and Functionalities

### Customer Features
**Login/Signup:**

New customers can sign up using their email and other credentials.
Registered users can log in to access their dashboard.
Customer Dashboard:

Displays product categories like Smart Doorbells, Doorlocks, Speakers, etc.
A cart icon is available for easy access to the shopping cart.
Product Selection:

Customers can browse products by category and view detailed product pages with accessories.

**Shopping Cart:**

Add items to the cart and proceed to checkout to finalize orders.
Checkout Process:

Customers can review warranties, discounts, and total costs.
Choose between Store Pickup or Home Delivery and pay via credit card.
For Store Pickup, select a pickup location from a dropdown list.

**Order History:**

View past orders with confirmation numbers and order details.
Cancel orders if the delivery date is more than 5 days away.

### Store Manager Features

Login: Managers can log in using their credentials.
Product Management: Store managers can add, edit, or delete products from the inventory.
Salesman Features
Login: Salesmen can log in to access their dashboard.
Customer Management: Add new customers by entering their details.
Order Management: Edit, delete, or update orders.
Technologies Used
React: Frontend UI library.
JavaScript (ES6): Core language for interactivity.
CSS: For styling the application.
Java Servlets: Backend technology for handling server-side logic.
MySQL: Relational database for storing accounts, orders, transactions.
MongoDB: NoSQL database for storing product reviews.

### Backend Operations
The backend operations are handled using Java Servlets, with data stored in both MySQL and MongoDB databases. It follows an MVC (Model-View-Controller) architecture to ensure clean separation of concerns.

### Database Design
MySQL
Accounts: Stores user login information.
Stores: Contains store locations for in-store pickups.
Customers: Contains customer details.
Transactions: Stores customer orders.
MongoDB
Product Reviews: Stores reviews for each product.

## Key Features
User Authentication: Secure login for customers.
Order Management: Store and manage transactions and orders.
Product Reviews: Submit and view reviews for products.
Trending Data: Show top products based on ratings and sales.

## Application Requirements
Login/Signup: Users must log in with their credentials stored in MySQL. New users can sign up, and their login info is stored in MySQL.
Submit Orders: Place orders for home delivery or in-store pickup.
Submit Product Reviews: After placing an order, customers can submit product reviews, which are stored in MongoDB.
Trending Data: Displays the top 5 most liked products, top 5 zip codes with the most sales, and top 5 most sold products.
Running the Application

## Prerequisites
Node.js and npm installed.
MySQL and MongoDB installed and running.
Ensure MySQL has the following tables: Accounts, Stores, Customers, Transactions.
Available Scripts
In the project directory, you can run:

npm start: Runs the app in development mode at http://localhost:3000.
npm test: Launches the test runner in interactive watch mode.
npm run build: Builds the app for production, optimizing the build for the best performance.
npm run eject: Eject the build configuration for customization.
MySQL Setup
Ensure MySQL is set up with tables for stores, customers, products, transactions, and login information. You can use MySQLDataStoreUtilities.java to manage these operations.

MongoDB Setup
Set up MongoDB with a collection for product reviews. Use MongoDBDataStoreUtilities.java to interact with this collection.
