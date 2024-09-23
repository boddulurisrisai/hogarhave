const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For hashing passwords
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { mysqlConnection } = require('./db');
const app = express();
const port = 3030;
const saltRounds = 10; // Number of salt rounds for bcrypt
const ordersRoute = require('./routes/orders'); 
const reviewRoutes = require('./routes/reviews');

// MySQL connection configuration
const dbOptions = {
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'smarthomes',
};

// Create MySQL connection
const connection = mysql.createConnection(dbOptions);
const sessionStore = new MySQLStore(dbOptions, connection);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  key: 'session_cookie_name',
  secret: 'SriSai*1999',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use('/api', ordersRoute);
app.use('/api/reviews', reviewRoutes);
// Helper function to log login attempts
function logLoginAttempt(email, accountType, success, userId = null) {
  const insertLogQuery = 'INSERT INTO login_logs (email, account_type, success, user_id) VALUES (?, ?, ?, ?)';
  connection.query(insertLogQuery, [email, accountType, success, userId], (err) => {
    if (err) {
      console.log('Failed to log login attempt:', err);
    }
  });
}

// Helper function to hash passwords
const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('Hashing failed');
  }
};

// Helper function to insert customer details
const insertCustomer = (customerDetails) => {
  return new Promise((resolve, reject) => {
    const customerQuery = `INSERT INTO customers (name, address, city, state, zip_code, phone_number, creditCard)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(customerQuery, [
      customerDetails.name,
      customerDetails.address,
      customerDetails.city,
      customerDetails.state,
      customerDetails.zip_code,
      customerDetails.phone_number,
      customerDetails.creditCard
    ], (err, customerResult) => {
      if (err) {
        reject('Failed to insert customer data');
      } else {
        resolve(customerResult.insertId);
      }
    });
  });
};

// Helper function to insert orders
const insertOrder = (orderDetails, customerId) => {
  return new Promise((resolve, reject) => {
    const orderQuery = `INSERT INTO orders (customer_id, total_amount, confirmation_number, order_date, delivery_date, delivery_type, store_location)
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(orderQuery, [
      customerId,
      orderDetails.total_amount,
      orderDetails.confirmation_number,
      orderDetails.order_date,
      orderDetails.delivery_date,
      orderDetails.delivery_type,
      orderDetails.store_location
    ], (err, orderResult) => {
      if (err) {
        reject('Failed to insert order data');
      } else {
        resolve(orderResult.insertId);
      }
    });
  });
};

// Helper function to insert order items
const insertOrderItems = (orderId, orderItems) => {
  return new Promise((resolve, reject) => {
    const orderItemsArray = orderItems.map(item => [
      orderId,
      item.name,
      item.imageUrl,
      item.price,
      item.quantity,
      item.warranty,
      item.retailerDiscount,
      item.rebate
    ]);
    const orderItemsQuery = `INSERT INTO order_items (order_id, name, imageUrl, product_price, quantity, warranty, retailer_discount, rebate) VALUES ?`;

    connection.query(orderItemsQuery, [orderItemsArray], (err) => {
      if (err) {
        reject('Failed to insert order items');
      } else {
        resolve();
      }
    });
  });
};

// Signup route with hashed passwords
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    const [existingUser] = await connection.promise().query(checkQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password and insert new user
    const hashedPassword = await hashPassword(password);
    const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    await connection.promise().query(insertQuery, [email, hashedPassword]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// User login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'An error occurred' });

    if (results.length > 0) {
      const user = results[0];

      // Compare the entered password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: 'An error occurred while checking the password' });

        if (isMatch) {
          req.session.userId = user.id;
          logLoginAttempt(email, 'user', true, user.id);
          res.status(200).json({ message: 'Login successful', user });
        } else {
          logLoginAttempt(email, 'user', false);
          res.status(400).json({ error: 'Incorrect password' });
        }
      });
    } else {
      logLoginAttempt(email, 'user', false);
      res.status(400).json({ error: 'Email not found' });
    }
  });
});

// Salesman and Store Manager login routes follow a similar structure to User login

// Store Manager login with hashed password verification
app.post('/store-manager/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM storemanager WHERE email = ?';

  connection.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'An error occurred' });

    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: 'An error occurred while checking the password' });

        if (isMatch) {
          logLoginAttempt(email, 'storemanager', true, user.id);
          res.status(200).json({ message: 'Login successful', user });
        } else {
          logLoginAttempt(email, 'storemanager', false);
          res.status(400).json({ error: 'Incorrect password' });
        }
      });
    } else {
      logLoginAttempt(email, 'storemanager', false);
      res.status(400).json({ error: 'Email not found' });
    }
  });
});

// Store data retrieval route
app.get('/api/stores', (req, res) => {
  const sql = 'SELECT * FROM store';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve store data' });
    res.json(results);
  });
});

//Cart Page

app.post('/api/cart', async (req, res) => {
  const { totalAmount, deliveryOption, items } = req.body;

  if (totalAmount === undefined || deliveryOption === undefined || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Total amount, delivery option, and items are required.' });
  }

  const cartQuery = 'INSERT INTO cart (totalAmount, deliveryOption) VALUES (?, ?)';
  
  try {
    // Insert into the cart
    const [cartResults] = await connection.promise().query(cartQuery, [totalAmount, deliveryOption]);
    const cartId = cartResults.insertId;

    // Prepare items for insertion into cart_items
    const cartItemsQuery = 'INSERT INTO cart_items (orderId, productId, name, image, price, quantity) VALUES ?';
    const cartItemsArray = items.map(item => [
      cartId,
      item.productId,
      item.name,
      item.image,
      item.price,
      item.quantity
    ]);

    // Insert cart items
    await connection.promise().query(cartItemsQuery, [cartItemsArray]);

    res.status(201).json({ id: cartId, totalAmount, deliveryOption, items });
  } catch (err) {
    console.error('Error inserting into cart or cart_items:', err);
    res.status(500).json({ error: 'Failed to add to cart.' });
  }
});

// Checkout route to handle order placement
app.post('/api/orders', (req, res) => {
  const {
    cart,
    total_amount,
    discountsApplied,
    warrantyTotal,
    confirmation_number,
    customerDetails,
    creditCard,
    email,
    deliveryType,
    storeLocation,
    deliveryAddress,
    tax,
    shippingCost
  } = req.body;

  // Insert customer into `customers` table
  const insertCustomerQuery = `
    INSERT INTO customers (name, phone_number, address, city, state, zip_code, creditCard, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(insertCustomerQuery, [
    customerDetails.name,
    customerDetails.phone_number,
    customerDetails.address,
    customerDetails.city,
    customerDetails.state,
    customerDetails.zip_code,
    customerDetails.email,
    creditCard
  ], (err, result) => {
    if (err) {
      console.error('Error inserting customer:', err);
      return res.status(500).json({ error: 'Failed to place order.' });
    }

    const customerId = result.insertId;

    // Insert order into `orders` table
    const insertOrderQuery = `
      INSERT INTO orders (confirmation_number, customer_id, total_amount, discounts_applied, shipping_cost, tax, delivery_type, delivery_address, store_location, order_status, order_date, delivery_date, warranty_cost, credit_card)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), DATE_ADD(NOW(), INTERVAL 12 DAY), ?, ?)
    `;

    connection.query(insertOrderQuery, [
      confirmation_number,
      customerId,
      total_amount,
      discountsApplied,
      shippingCost,
      tax,
      deliveryType,
      deliveryAddress,
      storeLocation,
      warrantyTotal,
      creditCard
    ], (err, result) => {
      if (err) {
        console.error('Error inserting order:', err);
        return res.status(500).json({ error: 'Failed to place order.' });
      }

      const orderId = result.insertId;

      // Insert cart items into `order_items` table
      const insertCartItemsQuery = `
        INSERT INTO order_items (order_id, name, product_price, quantity, warranty, retailer_discount, rebate, imageUrl)
        VALUES ?
      `;

      const cartItems = cart.map(item => [
        orderId,
        item.name,
        item.product_price,
        item.quantity,
        item.warranty,
        item.retailer_discount,
        item.rebate,
        item.imageUrl
      ]);

      connection.query(insertCartItemsQuery, [cartItems], (err) => {
        if (err) {
          console.error('Error inserting cart items:', err);
          return res.status(500).json({ error: 'Failed to save cart items.' });
        }

        return res.status(201).json({ message: 'Order placed successfully!' });
      });
    });
  });
});

// Run the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
