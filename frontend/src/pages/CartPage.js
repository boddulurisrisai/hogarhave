import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import Header from '../components/LoginHeader';
import axios from 'axios';
import './CheckoutPage'; // Assuming you have styles

function CartPage() {
  const { cart, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const [deliveryOption, setDeliveryOption] = useState('store-pickup');
  const navigate = useNavigate();

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const handleCheckout = async () => {
    // Prepare order details
    const orderDetails = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
      totalAmount: totalAmount.toFixed(2),
      deliveryOption,
    };

    try {
      // Make a POST request to store the order in MySQL
      const response = await axios.post('http://localhost:3030/api/cart', orderDetails);

      if (response.status === 200) {
        // Clear the cart after successful checkout
        clearCart();
        // Redirect to the checkout confirmation page
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="cart-page">
      <Header />
      <main className="main-content">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <p>{item.name} - ${(parseFloat(item.price) || 0).toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <h3>Total: ${totalAmount.toFixed(2)}</h3>
            </div>
            <div className="delivery-option">
              <h3>Select Delivery Option</h3>
              <label>
                <input
                  type="radio"
                  value="store-pickup"
                  checked={deliveryOption === 'store-pickup'}
                  onChange={handleDeliveryOptionChange}
                />
                In-store Pickup
              </label>
              <label>
                <input
                  type="radio"
                  value="home-delivery"
                  checked={deliveryOption === 'home-delivery'}
                  onChange={handleDeliveryOptionChange}
                />
                Home Delivery
              </label>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </main>
    </div>
  );
}

export default CartPage;
