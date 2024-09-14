import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader';

function CheckoutPage() {
  const { cart, clearCart, storeLocations } = useCart(); // Access cart, clearCart, and storeLocations from useCart hook
  const [selectedWarranty, setSelectedWarranty] = useState({});
  const [orderTotals, setOrderTotals] = useState({
    totalAmount: 0,
    shippingCost: 5, // Example shipping cost
    tax: 0,
    totalWithShippingAndTax: 0,
    discountsApplied: 0,
  });
  const [specialDiscounts] = useState(0.1); // 10% special discount
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [creditCard, setCreditCard] = useState(''); // Credit card state
  const [deliveryType, setDeliveryType] = useState('store'); // Default to store pickup
  const [selectedStore, setSelectedStore] = useState(''); // State for selected store

  const navigate = useNavigate();

  // Warranty cost set to $25
  const warrantyCost = 25;

  // Handle warranty selection
  const handleWarrantyChange = (itemName, isChecked) => {
    setSelectedWarranty(prevState => ({
      ...prevState,
      [itemName]: isChecked
    }));
  };

  // Calculate order totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalWarrantyCost = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      // Apply retailer discount
      const discount = item.retailerDiscount ? itemTotal * item.retailerDiscount : 0;
      totalDiscount += discount;

      // Add warranty cost if selected
      if (selectedWarranty[item.name]) {
        totalWarrantyCost += warrantyCost; // Use fixed warranty cost
      }
    });

    // Apply special discount (e.g., 10% off)
    const discountAmount = subtotal * specialDiscounts;
    const totalDiscountsApplied = totalDiscount + discountAmount;

    // Calculate tax and total amount with shipping
    const tax = subtotal * 0.07; // 7% tax
    const totalWithShippingAndTax = subtotal + orderTotals.shippingCost + tax - totalDiscountsApplied + totalWarrantyCost;

    setOrderTotals({
      totalAmount: subtotal,
      shippingCost: orderTotals.shippingCost,
      tax: tax,
      totalWithShippingAndTax: totalWithShippingAndTax,
      discountsApplied: totalDiscountsApplied,
    });
  };

  // Update totals when the cart or warranty selection changes
  useEffect(() => {
    calculateTotals();
  }, [cart, selectedWarranty]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      cart: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        warranty: selectedWarranty[item.name] ? warrantyCost : 0, // Use fixed warranty cost
        retailerDiscount: item.retailerDiscount,
        rebate: item.rebate || 0
      })),
      totalCost: orderTotals.totalWithShippingAndTax,
      discountsApplied: orderTotals.discountsApplied,
      confirmationNumber: Math.random().toString(36).substring(2, 9), // Random confirmation number
      orderDate: new Date(),
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 12)), // 12 days from now
      name,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
      creditCard, // Add credit card info
      deliveryType,
      selectedStore, // Add selected store if home delivery
    };

    // Save order to localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    storedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(storedOrders));

    // Clear cart after order is placed
    clearCart();

    // Navigate to OrdersPage
    navigate('/orders');
  };

  return (
    <>
    <Header />
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="order-summary">
          <h3>Order Summary</h3>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Display cart items */}
              <h3>Items in Cart</h3>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <p><strong>{item.name}</strong></p>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedWarranty[item.name] || false}
                        onChange={(e) => handleWarrantyChange(item.name, e.target.checked)}
                      />
                      Add Warranty (${warrantyCost})
                    </label>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <h3>Order Summary</h3>
              <p>Subtotal: ${orderTotals.totalAmount.toFixed(2)}</p>
              <p>Discounts Applied: -${orderTotals.discountsApplied.toFixed(2)}</p>
              <p>Shipping: ${orderTotals.shippingCost.toFixed(2)}</p>
              <p>Tax: ${orderTotals.tax.toFixed(2)}</p>
              <p><strong>Total: ${orderTotals.totalWithShippingAndTax.toFixed(2)}</strong></p>

              {/* Customer Information Form */}
              <h3>Customer Information</h3>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code:</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Credit Card:</label>
                <input
                  type="text"
                  value={creditCard}
                  onChange={(e) => setCreditCard(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Type:</label>
                <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                  <option value="store">Store Pickup</option>
                  <option value="home">Home Delivery</option>
                </select>
              </div>

              {deliveryType === 'store' && (
                <div className="form-group">
                  <label>Select Store:</label>
                  <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                    <option value="">Select a store</option>
                    {storeLocations && storeLocations.map((store, index) => (
                      <option key={index} value={store.id}>
                        {store.name} - {store.zipCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit">Place Order</button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default CheckoutPage;
