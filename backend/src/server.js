const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { mysqlConnection } = require('./db');
const app = express();
const port = 3030;
const saltRounds = 10; // Number of salt rounds for bcrypt
const reviewRoutes = require('./routes/reviews');
const mongoose = require('mongoose');
const Review = require('./models/Review'); // Adjust the path as needed
const trendingRoutes = require('./routes/trendingRoutes'); // Import the trending routes
const ordersRoute = require('./routes/orders');

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

if (mongoose.connection.readyState === 0) {
  mongoose.connect('mongodb://localhost:27017/smarthomes', {
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected to localhost:27017'))
  .catch(err => console.error('MongoDB connection error:', err));
}
// Middleware
// Increase the limit to 1MB (1 * 1024 * 1024 bytes)
app.use(bodyParser.json({ limit: '1mb' }));

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
app.use('/api', trendingRoutes); // This can be adjusted as needed

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

app.post('/salesman/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM salesman WHERE email = ?';

  connection.query(query, [email], (err, results) => {
      if (err) return res.status(500).json({ error: 'An error occurred' });

      if (results.length > 0) {
          const user = results[0];

          // Compare the entered password with the hashed password in the database
          bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) return res.status(500).json({ error: 'An error occurred while checking the password' });

              if (isMatch) {
                  req.session.userId = user.id; // Store the user ID in session
                  logLoginAttempt(email, 'salesman', true, user.id);
                  res.status(200).json({ message: 'Login successful', user });
              } else {
                  logLoginAttempt(email, 'salesman', false);
                  res.status(400).json({ error: 'Incorrect password' });
              }
          });
      } else {
          logLoginAttempt(email, 'salesman', false);
          res.status(400).json({ error: 'Email not found' });
      }
  });
});


// Salesman and Store Manager login routes follow a similar structure to User login

// Store Manager login with hashed password verification
/*app.post('/store-manager/login', (req, res) => {
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
});*/
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

/*Cart Page
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
    const cartItemsArray = items.map(item => {
      const maxImageLength = 255; // Set your maximum length for image URL
      const imageValue = item.image && item.image.length > maxImageLength ? null : item.image;

      return [
        cartId,
        item.productId,
        item.name,
        imageValue,  // Use the validated image value
        item.price,
        item.quantity
      ];
    });

    // Insert cart items
    await connection.promise().query(cartItemsQuery, [cartItemsArray]);

    res.status(201).json({ id: cartId, totalAmount, deliveryOption, items });
  } catch (err) {
    console.error('Error inserting into cart or cart_items:', err);
    res.status(500).json({ error: 'Failed to add to cart.' });
  }
});

// API to fetch cart details by cart ID (or user ID if applicable)

app.get('/api/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;

  // Fetch cart information
  const cartQuery = 'SELECT * FROM cart WHERE id = ?';
  db.query(cartQuery, [cartId], (cartErr, cartResult) => {
    if (cartErr) return res.status(500).json({ error: 'Error fetching cart' });

    if (cartResult.length === 0) return res.status(404).json({ error: 'Cart not found' });

    const cart = cartResult[0];

    // Fetch cart items associated with the cart
    const cartItemsQuery = 'SELECT * FROM cart_items WHERE orderId = ?';
    db.query(cartItemsQuery, [cartId], (itemsErr, itemsResult) => {
      if (itemsErr) return res.status(500).json({ error: 'Error fetching cart items' });

      const cartDetails = {
        cartId: cart.id,
        totalAmount: cart.totalAmount,
        deliveryOption: cart.deliveryOption,
        createdAt: cart.createdAt,
        items: itemsResult,
      };

      res.json(cartDetails);
    });
  });
});
*/

// Fetch customer by email
// Route to check if customer exists



// Route to create a new customer
app.post('/api/customers', (req, res) => {
  const {customer_id, name, email, address, city, state, zipCode, phoneNumber, creditCard } = req.body;

  const query = `INSERT INTO customers (customer_id, name, email, address, city, state, zip_code, phone_number, creditCard)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [customer_id, name, email, address, city, state, zipCode, phoneNumber, creditCard], (err, result) => {
    if (err) {
      console.error('Error inserting customer:', err);
      res.status(500).json({ error: 'Failed to insert customer' });
    } else {
      res.status(201).json({ message: 'Customer created successfully', customer_id });
    }
  });
});

app.get('/api/orders', (req, res) => {
  const query = `
  SELECT o.*, oi.item_id, oi.name, oi.product_price, oi.quantity, oi.imageUrl 
  FROM orders o 
  LEFT JOIN order_items oi ON o.order_id = oi.order_id
  ORDER BY o.order_date ASC;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Organize results by order_id
    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          confirmation_number: row.confirmation_number,
          customer_id: row.customer_id,
          total_amount: row.total_amount,
          order_status: row.order_status,
          order_date: row.order_date,
          delivery_date: row.delivery_date,
          items: []
        };
      }
      // Add item details to the corresponding order
      if (row.item_id) {
        orders[row.order_id].items.push({
          item_id: row.item_id,
          name: row.name,
          product_price: row.product_price,
          quantity: row.quantity,
          imageUrl: row.imageUrl
        });
      }
    });

    // Send the organized orders array as the response
    res.json(Object.values(orders));
  });
});

// Create a new order
/*app.post('/api/orders', (req, res) => {
  const { confirmation_snumber, customer_id, total_amount, discounts_applied, shipping_cost, tax, delivery_type, delivery_address, store_location, order_status, order_date, delivery_date, warranty_cost, credit_card } = req.body;

  const query = `INSERT INTO orders (confirmation_number, customer_id, total_amount, discounts_applied, shipping_cost, tax, delivery_type, delivery_address, store_location, order_status, order_date, delivery_date, warranty_cost, credit_card)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [confirmation_number, customer_id, total_amount, discounts_applied, shipping_cost, tax, delivery_type, delivery_address, store_location, order_status, order_date, delivery_date, warranty_cost, credit_card], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      res.status(500).json({ error: 'Failed to insert order' });
    } else {
      res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
    }
  });
});
*/
function formatDateForMySQL(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Helper function to generate a confirmation number (you can use a random string generator or hash)
function generateConfirmationNumber() {
  return Math.random().toString(36).substr(2, 9).toUpperCase(); // Example: ABC123XYZ
}

app.post('/api/orders', async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    city,
    state,
    zipCode,
    creditCard,
    deliveryType,
    deliveryAddress,
    storeLocation,
    cartItems,
    discountsApplied,
    shippingCost,
    tax,
    totalWithShippingAndTax,
    warrantyCost
  } = req.body;

  try {
    // Insert customer details
    const insertCustomerQuery = `
      INSERT INTO customers (name, email, phone_number, address, city, state, zip_code, creditCard)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [customerResult] = await connection.promise().query(insertCustomerQuery, [
      name,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      creditCard
    ]);

    const customerId = customerResult.insertId;

    // Generate confirmation number (assuming you have a function)
    const confirmationNumber = generateConfirmationNumber();

    // Order and delivery dates
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 12);

    // Insert order details
    const insertOrderQuery = `
      INSERT INTO orders (
        confirmation_number, customer_id, total_amount, discounts_applied, 
        shipping_cost, tax, delivery_type, delivery_address, store_location, 
        order_status, order_date, delivery_date, warranty_cost, credit_card
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [orderResult] = await connection.promise().query(insertOrderQuery, [
      confirmationNumber,
      customerId,
      totalWithShippingAndTax,
      discountsApplied,
      shippingCost,
      tax,
      deliveryType,
      deliveryType === 'home' ? deliveryAddress : null,
      deliveryType === 'store' ? storeLocation : null,
      'pending',
      orderDate,
      deliveryDate,
      warrantyCost,
      creditCard
    ]);

    const orderId = orderResult.insertId;

    // Prepare order items data
    const orderItemsData = cartItems.map(item => [
      orderId,
      item.price,
      item.quantity,
      item.warrantySelected ? 1 : 0,
      item.retailer_discount || 0,
      item.rebate || 0,
      item.name,
      item.imageUrl || null
    ]);

    // Insert order items
    const insertOrderItemsQuery = `
      INSERT INTO order_items (
        order_id, product_price, quantity, warranty, retailer_discount, rebate, name, imageUrl
      )
      VALUES ?
    `;
    await connection.promise().query(insertOrderItemsQuery, [orderItemsData]);

    // Respond to the client
    res.status(201).json({
      message: 'Order placed successfully',
      order_id: orderId,
      confirmation_number: confirmationNumber
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});


app.get('/api/reviews/:doorbellId', async (req, res) => {
  try {
    const reviews = await Review.find({ doorbellId: req.params.doorbellId });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

/*
app.delete('/api/orders/:confirmationNumber', async (req, res) => {
  try {
    const result = await Order.findOneAndDelete({ confirmation_number: req.params.confirmationNumber });
    if (!result) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ message: 'Order canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});
*/
//Delete from db
app.delete('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  // Start a transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to start transaction.' });
    }

    const deleteOrderItemsQuery = `
      DELETE FROM order_items
      WHERE order_id = ?;
    `;

    // First, delete from order_items
    connection.query(deleteOrderItemsQuery, [orderId], (error) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error deleting order items:', error);
          return res.status(500).json({ message: 'Failed to delete order items.' });
        });
      }

      const deleteOrderQuery = `
        DELETE FROM orders
        WHERE order_id = ?;
      `;

      // Then, delete from orders
      connection.query(deleteOrderQuery, [orderId], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error deleting order:', error);
            return res.status(500).json({ message: 'Failed to delete the order.' });
          });
        }

        // Check if any rows were affected (order found)
        if (results.affectedRows === 0) {
          return connection.rollback(() => {
            return res.status(404).json({ message: 'Order not found.' });
          });
        }

        // Commit the transaction if everything went well
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              console.error('Error committing transaction:', err);
              return res.status(500).json({ message: 'Failed to commit transaction.' });
            });
          }
          
          res.status(200).json({ message: 'Order and order items canceled successfully.' });
        });
      });
    });
  });
});


// server.js

app.get('/api/reviews/:ProductModelName', async (req, res) => {
  const { ProductModelName } = req.params.ProductModelName; // Extract ProductModelName from request parameters

  try {
    // Fetch reviews from the database based on ProductModelName
    const reviews = await Review.find({ ProductModelName });

    // Check if any reviews were found
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product model' });
    }

    // Return the found reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
app.get('/api/reviews', async (req, res) => {
  const productModelName = req.query.ProductModelName;
  try {
      const reviews = await Review.find({ ProductModelName: productModelName });
      res.json({ reviews });
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send('Server error');
  }
});

/* trending page */

app.get('/api/trending', async (req, res) => {
  try {
    // Top five most liked products (highest average review rating)
    const mostLikedProducts = await Review.aggregate([
        {
            $group: {
                _id: "$ProductModelName",
                averageRating: { $avg: "$ReviewRating" },
                totalLikes: { 
                    $sum: { $cond: [{ $gte: ["$ReviewRating", 4] }, 1, 0] } // Count as a like if rating is 4 or higher
                },
            }
        },
        { $sort: { averageRating: -1, totalLikes: -1 } }, // Sort by average rating and total likes
        { $limit: 5 }
    ]);
    
    //console.log('Most Liked Products:', mostLikedProducts);

    // Top five zip-codes where maximum number of products sold
    const zipCodeStats = await Review.aggregate([
        {
            $group: {
                _id: "$StoreZip",
                totalSold: { $sum: 1 } // Assuming each review corresponds to a sold product
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
    ]);
    
    //console.log('Top Zip Codes:', zipCodeStats);

    // Top five most sold products regardless of the rating
    const mostSoldProducts = await Review.aggregate([ // Changed from reviews to Review
        {
            $group: {
                _id: "$ProductModelName",
                totalSold: { $sum: 1 } // Assuming each review corresponds to a sold product
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
    ]);

   // console.log('Most Sold Products:', mostSoldProducts);

    // Send the collected data as JSON
    res.json({
        mostLikedProducts,
        topZipCodes: zipCodeStats,
        mostSoldProducts
    });
} catch (error) {
    console.error('Error fetching trending data:', error);
    res.status(500).json({ message: 'Internal server error' });
}
});

// Run the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


