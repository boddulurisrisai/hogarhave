import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader';

function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {}; // Access passed order details

  // Debugging: Log the orderDetails
  console.log('Order Details:', orderDetails);

  if (!orderDetails) {
    return <p>No order details available.</p>;
  }

  const { cart, confirmationNumber, orderDate, deliveryDate, totalCost } = orderDetails;

  // Calculate if the delivery date is more than 5 days away
  const today = new Date();
  const deliveryDateObj = new Date(deliveryDate);
  const daysUntilDelivery = Math.ceil((deliveryDateObj - today) / (1000 * 60 * 60 * 24));

  // Handler for canceling the order
  const handleCancelOrder = () => {
    // Implement cancel order logic here
    alert('Order has been canceled');
    // Redirect or update state as needed
    navigate('/');
  };

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h2>Order Details</h2>
        <p>Confirmation Number: {confirmationNumber}</p>
        <p>Order Date: {new Date(orderDate).toLocaleDateString()}</p>
        <p>Delivery Date: {new Date(deliveryDate).toLocaleDateString()}</p>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {cart && cart.length > 0 ? (
              cart.map(item => (
                <li key={item.id}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} />
                  {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                </li>
              ))
            ) : (
              <p>No items in the cart.</p>
            )}
          </ul>
          <h3>Total: ${totalCost.toFixed(2)}</h3>
        </div>

        {/* Cancel Order Option */}
        {daysUntilDelivery > 5 && (
          <button className="cancel-order-btn" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
