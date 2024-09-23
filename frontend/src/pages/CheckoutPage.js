import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader';
import axios from 'axios';

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [storeLocations, setStoreLocations] = useState([]);
  const [selectedWarranty, setSelectedWarranty] = useState({});
  const [orderTotals, setOrderTotals] = useState({
    totalAmount: 0,
    totalWithShippingAndTax: 0,
    discountsApplied: 0,
    warrantyTotal: 0,
  });
  const [specialDiscounts] = useState(0.1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [deliveryType, setDeliveryType] = useState('store');
  const [storeLocation, setSelectedStore] = useState('');
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3030/api/orders';
  const storeApiUrl = 'http://localhost:3030/api/stores';
  const warrantyCost = 25;
  const fixedTax = 20;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(storeApiUrl);
        setStoreLocations(response.data.map(store => `${store.name}, ${store.city}`));
      } catch (error) {
        console.error('Error fetching store locations:', error);
      }
    };

    fetchStores();
  }, [storeApiUrl]);

  const handleWarrantyChange = (itemName, isChecked) => {
    setSelectedWarranty(prevState => ({
      ...prevState,
      [itemName]: isChecked,
    }));
  };

  useEffect(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalWarrantyCost = 0;

    cart.forEach(item => {
      const itemTotal = Number(item.product_price) * Number(item.quantity);
      subtotal += itemTotal;

      const discount = item.retailer_discount ? itemTotal * item.retailer_discount : 0;
      totalDiscount += discount;

      if (selectedWarranty[item.name]) {
        totalWarrantyCost += warrantyCost;
      }
    });

    const discountAmount = subtotal * specialDiscounts;
    const totalDiscountsApplied = totalDiscount + discountAmount;

    const totalWithShippingAndTax = subtotal + fixedTax - totalDiscountsApplied + totalWarrantyCost;

    setOrderTotals({
      totalAmount: subtotal,
      totalWithShippingAndTax: totalWithShippingAndTax,
      discountsApplied: totalDiscountsApplied,
      warrantyTotal: totalWarrantyCost,
    });
  }, [cart, selectedWarranty, specialDiscounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const order = {
      cart: cart.map(item => ({
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.product_price,
        quantity: item.quantity,
        warranty: selectedWarranty[item.name] ? warrantyCost : 0,
        retailerDiscount: item.retailer_discount,
        rebate: item.rebate || 0,
      })),
      total_amount: orderTotals.totalWithShippingAndTax,
      discountsApplied: orderTotals.discountsApplied,
      warrantyTotal: orderTotals.warrantyTotal,
      confirmation_number: Math.random().toString(36).substring(2, 9),
      customerDetails: {
        name,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
        email,
      },
      creditCard,
      deliveryType,
      storeLocation,
      tax: fixedTax,
    };

    try {
      const response = await axios.post(backendUrl, order);
      if (response.status === 201) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
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
                <h3>Items in Cart</h3>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.imageUrl} alt={item.name} style={{ width: '50px' }} />
                    <p><strong>{item.name}</strong></p>
                    <p>Price: ${item.product_price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedWarranty[item.name] || false}
                          onChange={(e) => handleWarrantyChange(item.name, e.target.checked)}
                        />
                        Add 1-year Warranty ($25)
                      </label>
                    </div>
                  </div>
                ))}

                <div className="checkout-totals">
                  <p>Subtotal: ${orderTotals.totalAmount.toFixed(2)}</p>
                  <p>Warranty Total: ${orderTotals.warrantyTotal.toFixed(2)}</p>
                  <p>Discounts Applied: -${orderTotals.discountsApplied.toFixed(2)}</p>
                  <p>Tax: ${fixedTax.toFixed(2)}</p>
                  <h3>Total: ${orderTotals.totalWithShippingAndTax.toFixed(2)}</h3>
                </div>

                <h3>Customer Information</h3>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip_code">Zip Code</label>
                  <input
                    type="text"
                    id="zip_code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="text"
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <h3>Payment Information</h3>
                <div className="form-group">
                  <label htmlFor="creditCard">Credit Card</label>
                  <input
                    type="text"
                    id="creditCard"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                    required
                  />
                </div>

                <h3>Delivery Type</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      value="store"
                      checked={deliveryType === 'store'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                    />
                    In-Store Pickup
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="home"
                      checked={deliveryType === 'home'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                    />
                    Home Delivery
                  </label>
                </div>

                {deliveryType === 'store' && (
                  <div className="form-group">
                    <label htmlFor="storeLocation">Select Store Location</label>
                    <select
                      id="storeLocation"
                      value={storeLocation}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      required
                    >
                      <option value="">-- Select Store --</option>
                      {storeLocations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
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
