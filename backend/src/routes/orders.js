const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust path to your DB config

// Fetch all orders for a customer
router.get('/orders/:customerId', (req, res) => {
  const { customerId } = req.params;
  
  const sql = `
    SELECT o.order_id AS id, o.confirmation_number, o.order_date, o.delivery_date, o.delivery_type, o.total_amount, 
           oi.item_id AS id, oi.name AS itemName, oi.quantity, oi.product_price, oi.warranty, 
           oi.imageUrl
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.customer_id = ?
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    // Group the orders and items properly to return a structured response
    const ordersMap = {};
    results.forEach(row => {
      const orderId = row.orderId;

      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          confirmationNumber: row.confirmation_number,
          orderDate: row.order_date,
          deliveryDate: row.delivery_date,
          deliveryType: row.delivery_type,
          totalCost: row.total_amount,
          cart: []
        };
      }

      ordersMap[orderId].cart.push({
        orderItemId: row.orderItemId,
        name: row.itemName,
        quantity: row.quantity,
        price: row.product_price,
        warranty: row.warranty,
        image: row.imageUrl,
        //accessories: row.accessories ? JSON.parse(row.accessories) : []
      });
    });

    const ordersArray = Object.values(ordersMap);
    res.json(ordersArray);
  });
});

module.exports = router;
