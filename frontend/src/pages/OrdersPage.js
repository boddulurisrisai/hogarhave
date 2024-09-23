import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { customer_id } = location.state || {}; // Retrieve customer_id from navigation state
  const backendUrl = 'http://localhost:3030/api/orders/customer';

  useEffect(() => {
    if (customer_id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${backendUrl}/${customer_id}`);
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      fetchOrders();
    }
  }, [customer_id]);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.confirmation_number}>
              <div>
                <h3>Order #{order.confirmation_number}</h3>
                <p>Order Date: {order.order_date}</p>
                <p>Delivery Date: {order.delivery_date}</p>
                <p>Total: ${order.total_amount}</p>
                <button>Track Order</button>
                {order.canCancel && <button>Cancel Order</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
