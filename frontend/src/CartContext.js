import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders')) || []);
  const [customerInfo, setCustomerInfo] = useState({});
  const [storeLocations, setStoreLocations] = useState([]);

  // Fetch store locations from the API
  useEffect(() => {
    const fetchStoreLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/stores');
        setStoreLocations(response.data);
      } catch (error) {
        console.error('Error fetching store locations:', error);
      }
    };

    fetchStoreLocations();
  }, []);

  // Function to add an item to the cart
  const addToCart = (product, quantity = 1) => {
    console.log("Adding product to cart:", product); // Log product details
    console.log("Image URL:", product.image);        // Log the image URL to check correctness

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...product, quantity }]);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Function to update item quantity in the cart
  const updateItemQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Function to handle checkout
  const checkout = async (customerData) => {
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const order = {
      id: new Date().getTime(),
      items: cart,
      totalAmount,
      ...customerData,
      confirmationNumber: Math.floor(Math.random() * 1000000),
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    };

    try {
      // Save order to database
      await axios.post('http://localhost:3030/api/orders', order);
      // Update local state
      const updatedOrders = [...orders, order];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      clearCart();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  // Function to cancel an order
  const cancelOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      customerInfo,
      storeLocations,
      addToCart,
      removeFromCart,
      updateItemQuantity,
      clearCart,
      checkout,
      cancelOrder,
      setCustomerInfo,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
