import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import Header from '../components/LoginHeader';

function CheckoutPage() {
  const { cart, checkout } = useCart();
  const [customerData, setCustomerData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    creditCard: '',
    deliveryType: 'homeDelivery',
    storeId: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderTotals, setOrderTotals] = useState({});
  const navigate = useNavigate();

  const storeLocations = [
    { id: 1, name: 'Store 1', zipCode: '10001' },
    { id: 2, name: 'Store 2', zipCode: '10002' },
    { id: 3, name: 'Store 3', zipCode: '10003' },
    { id: 4, name: 'Store 4', zipCode: '10004' },
    { id: 5, name: 'Store 5', zipCode: '10005' },
    { id: 6, name: 'Store 6', zipCode: '10006' },
    { id: 7, name: 'Store 7', zipCode: '10007' },
    { id: 8, name: 'Store 8', zipCode: '10008' },
    { id: 9, name: 'Store 9', zipCode: '10009' },
    { id: 10, name: 'Store 10', zipCode: '10010' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate totals
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = 10;
    const tax = totalAmount * 0.08;
    const totalWithShippingAndTax = totalAmount + shippingCost + tax;

    // Generate a confirmation number (for demo purposes)
    const newConfirmationNumber = Math.floor(Math.random() * 1000000).toString();
    setConfirmationNumber(newConfirmationNumber);

    // Set pickup date to 12 days from now
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate.getTime() + 12 * 24 * 60 * 60 * 1000); // Delivery date exactly 12 days from now
    setPickupDate(deliveryDate.toDateString());
    setOrderDate(orderDate.toDateString());

    // Prepare order details
    const orderDetails = {
      confirmationNumber: newConfirmationNumber,
      orderDate: orderDate.toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      cart: cart, // Include all cart items with image URLs
      totalCost: totalWithShippingAndTax,
    };

    // Call checkout function and pass order details
    checkout(customerData, orderDetails);

    setOrderTotals({
      totalAmount,
      shippingCost,
      tax,
      totalWithShippingAndTax
    });

    setOrderPlaced(true);
    setTimeout(() => {
      navigate('/orders', { state: { orderDetails } }); // Pass order details to OrdersPage
    }, 3000);
  };

  return (
    <div>
      <Header />
      <div className="checkout-container">
        <div className="checkout-box">
          <h2>Checkout</h2>

          {orderPlaced ? (
            <div className="order-confirmation">
              <h3>Your order has been placed successfully!</h3>
              <p>Confirmation Number: {confirmationNumber}</p>
              <p>Order Date: {orderDate}</p>
              <p>Pickup/Delivery Date: {pickupDate}</p>
              <p>You will be redirected to the orders page shortly.</p>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Customer Info */}
              <h3>Shipping Address</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  value={customerData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  value={customerData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="zipCode"
                  value={customerData.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  required
                />
              </div>

              {/* Payment Info */}
              <h3>Payment Method</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="creditCard"
                  value={customerData.creditCard}
                  onChange={handleInputChange}
                  placeholder="Credit Card"
                  required
                />
              </div>

              {/* Delivery Type */}
              <h3>Delivery Option</h3>
              <div className="form-group">
                <select name="deliveryType" value={customerData.deliveryType} onChange={handleInputChange}>
                  <option value="homeDelivery">Home Delivery</option>
                  <option value="storePickup">In-Store Pickup</option>
                </select>
              </div>

              {/* Store Location Dropdown */}
              {customerData.deliveryType === 'storePickup' && (
                <div className="form-group">
                  <label htmlFor="storeId">Select Store:</label>
                  <select name="storeId" value={customerData.storeId} onChange={handleInputChange} required>
                    <option value="">Select Store</option>
                    {storeLocations.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} - {store.zipCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="submit-button">Place Order</button>
            </form>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Subtotal: ${orderTotals.totalAmount ? orderTotals.totalAmount.toFixed(2) : '0.00'}</p>
          <p>Shipping: ${orderTotals.shippingCost ? orderTotals.shippingCost.toFixed(2) : '0.00'}</p>
          <p>Tax: ${orderTotals.tax ? orderTotals.tax.toFixed(2) : '0.00'}</p>
          <h3>Total: ${orderTotals.totalWithShippingAndTax ? orderTotals.totalWithShippingAndTax.toFixed(2) : '0.00'}</h3>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
