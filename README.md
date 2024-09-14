# HogarHaven E-commerce Application

An online retailer application developed using **React**. This application allows customers to browse smart home products, create accounts, place orders, and track them, while also offering specific roles and functionality for store managers and salesmen.

## Project Overview

This project aims to create a seamless shopping experience for SmartHomes customers, where they can place orders, manage accounts, and track order status, while managers and salesmen handle the backend operations.

## Folder Structure

- **`public/images`**: Contains all images used across the application.
- **`components`**: Includes reusable UI components like header, footer, etc., used across multiple pages.
- **`pages`**: Contains the main page components for the different sections of the application (Login, Dashboard, Product Selection, etc.).

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

1. **Login/Signup**:
    - New customers must sign up using their email and other credentials.
    - Registered users can log in to access their customer dashboard.

2. **Customer Dashboard**:
    - Displays product categories (Smart Doorbells, Smart Doorlocks, Smart Speakers, etc.).
    - A cart icon is available for quick access to the shopping cart.

3. **Product Selection**:
    - Customers can browse through products by category.
    - Clicking on a product image will take the user to a detailed product page that includes associated accessories.

4. **Shopping Cart**:
    - Customers can add items to their cart, with the number of items reflected on the cart icon in the header.
    - Proceed to checkout from the cart to finalize the order.

5. **Checkout Process**:
    - Customers can see item warranties, discounts, and total costs during checkout.
    - Customers need to enter their personal information, choose a delivery option (Store Pickup or Home Delivery), and pay using a credit card.
    - For store pickup, the customer must select a pickup location from a dropdown list.

6. **Order History**:
    - After placing an order, customers can view their past orders in the 'Account' section.
    - Each order entry shows the confirmation number, order details, and an option to cancel the order if the delivery is more than 5 days away.

### Store Manager Features

1. **Login**: Managers can log in using their credentials.
2. **Product Management**: Store managers can add, edit, or delete products from the product inventory.

### Salesman Features

1. **Login**: Salesmen can log in to access their dashboard.
2. **Customer Management**: Salesmen can add new customers to the system by entering customer details.
3. **Order Management**: Salesmen can edit, delete, or update the status of orders.

## Technologies Used

- **React**: Frontend library for building the UI.
- **CSS**: For styling the application.
- **JavaScript (ES6)**: Core language for building interactivity.

