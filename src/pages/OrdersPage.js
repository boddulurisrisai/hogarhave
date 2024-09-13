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
    // Sort orders by orderDate in ascending order (older first)
    const sortedOrders = storedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    console.log('Sorted Orders:', sortedOrders); // Debugging line
    setOrders(sortedOrders);
  }, []);

  const handleCancelOrder = (confirmationNumber) => {
    // Confirm before canceling
    if (window.confirm('Are you sure you want to cancel this order?')) {
      // Filter out the canceled order
      const updatedOrders = orders.filter(order => order.confirmationNumber !== confirmationNumber);
      // Update localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      // Update state
      setOrders(updatedOrders);
      // Notify the user
      alert('Order has been canceled');
      // Redirect to homepage
      navigate('/');
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h2>Your Past Orders</h2>

        {/* Display the selected order details at the top */}
        {selectedOrder && (
          <div className="order-details" style={{ marginBottom: '20px' }}>
            <h2>Order Details</h2>
            <p><strong>Confirmation Number:</strong> {selectedOrder.confirmationNumber || 'N/A'}</p>
            <p><strong>Total Cost:</strong> ${Number(selectedOrder.totalCost).toFixed(2) || '0.00'}</p>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <ul>
                {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                  selectedOrder.cart.map(item => (
                    <li key={item.id} className="order-item">
                      <img 
                        src={item.image || 'default-image-url'} 
                        alt={item.name || 'Item'} 
                        style={{ width: '100px', height: '100px', marginRight: '10px' }} 
                      />
                      <span>{item.name || 'Unnamed Item'} - {item.quantity || 0} x ${item.price ? Number(item.price).toFixed(2) : '0.00'}</span>
                      {item.accessories && item.accessories.length > 0 && (
                        <div>
                          <h4>Accessories:</h4>
                          <ul>
                            {item.accessories.map(acc => (
                              <li key={acc.id}>
                                <img 
                                  src={acc.image || 'default-image-url'} 
                                  alt={acc.name || 'Accessory'} 
                                  style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                                />
                                <span>{acc.name || 'Unnamed Accessory'} - ${acc.price ? Number(acc.price).toFixed(2) : '0.00'}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.warranty > 0 && (
                        <div>
                          <span>Warranty Cost: ${item.warranty.toFixed(2)}</span>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p>No items in the cart.</p>
                )}
              </ul>
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

        {/* Display all orders */}
        {orders.length > 0 ? (
          <ul className="orders-list">
            {orders.map(order => (
              <li key={order.confirmationNumber} onClick={() => handleOrderClick(order)}>
                <h3>Order {order.confirmationNumber}</h3>
                <p>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                <p>Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                <p>Delivery Type: {order.deliveryType === 'home' ? 'Home Delivery' : 'Store Pickup'}</p>
                <p>Total Cost: ${order.totalCost ? Number(order.totalCost).toFixed(2) : '0.00'}</p>
                <div>
                  {order.cart && order.cart.length > 0 ? (
                    order.cart.map(item => (
                      <div key={item.id}>
                        <img 
                          src={item.image || 'default-image-url'} 
                          alt={`Order ${order.confirmationNumber} - ${item.name}`} 
                          style={{ width: '100px', height: 'auto', marginRight: '10px' }} 
                        />
                      </div>
                    ))
                  ) : (
                    <p>No items in the cart.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
