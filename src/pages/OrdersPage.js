import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Stored Orders:', storedOrders); // Debugging line
    setOrders(storedOrders);
  }, []);

  const handleCancelOrder = (confirmationNumber) => {
    // Filter out the canceled order
    const updatedOrders = orders.filter(order => order.confirmationNumber !== confirmationNumber);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    alert('Order has been canceled');
    navigate('/');
  };

  const handleOrderClick = (order) => {
    console.log('Selected Order:', order); // Debugging line
    setSelectedOrder(order);
  };

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h2>Your Past Orders</h2>
        {orders.length > 0 ? (
          <ul className="orders-list">
            {orders.map(order => (
              <li key={order.confirmationNumber} onClick={() => handleOrderClick(order)}>
                <h3>Order {order.confirmationNumber}</h3>
                <p>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                <p>Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}

        {selectedOrder && (
          <div className="order-details">
            <h2>Order Details</h2>
            <p><strong>Confirmation Number:</strong> {selectedOrder.confirmationNumber || 'N/A'}</p>
            <p><strong>Order Date:</strong> {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'N/A'}</p>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <ul>
                {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                  selectedOrder.cart.map(item => (
                    <li key={item.id} className="order-item">
                      <img 
                        src={item.image || 'default-image-url'} 
                        alt={item.name || 'Item'} 
                        style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                      />
                      <span>{item.name || 'Unnamed Item'} - {item.quantity || 0} x ${item.price ? Number(item.price).toFixed(2) : '0.00'}</span>
                    </li>
                  ))
                ) : (
                  <p>No items in the cart.</p>
                )}
              </ul>
              <h3><strong>Total:</strong> ${Number(selectedOrder.totalCost).toFixed(2) || '0.00'}</h3>
            </div>

            {/* Cancel Order Option */}
            {(() => {
              const today = new Date();
              const deliveryDateObj = selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate) : new Date();
              const daysUntilDelivery = Math.ceil((deliveryDateObj - today) / (1000 * 60 * 60 * 24));
              
              return daysUntilDelivery > 5 ? (
                <button className="cancel-order-btn" onClick={() => handleCancelOrder(selectedOrder.confirmationNumber)}>
                  Cancel Order
                </button>
              ) : (
                <p>Orders can only be canceled if delivery is more than 5 days away.</p>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
