import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext

// Hardcoded accessories data
const accessoriesData = {
  "Ring Video Doorbell": [
    { id: '1', name: 'Ring Chime', price: 50, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
    { id: '2', name: 'Ring Plug Adapter', price: 30, image: '/images/doorbell/accessories/Ring Plug Adapter.jpeg' },
    { id: '3', name: 'Ring Solar Panel', price: 20, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
  ],
  "Nest Hello": [
    { id: '1', name: 'Nest Chime', price: 50, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
    { id: '2', name: 'Nest Plug Adapter', price: 30, image: '/images/doorbell/accessories/Ring Plug Adapter.jpeg' },
    { id: '3', name: 'Nest Solar Panel', price: 20, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
  ],
  "Eufy Security Video Doorbell": [
    { id: '1', name: 'Eufy Chime', price: 50, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
    { id: '2', name: 'Eufy Plug Adapter', price: 30, image: '/images/doorbell/accessories/Ring Plug Adapter.jpeg' },
    { id: '3', name: 'Eufy Solar Panel', price: 20, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
  ],
  "Arlo Video Doorbell": [
    { id: '1', name: 'Arlo Chime', price: 50, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
    { id: '2', name: 'Arlo Plug Adapter', price: 30, image: '/images/doorbell/accessories/Ring Plug Adapter.jpeg' },
    { id: '3', name: 'Arlo Solar Panel', price: 20, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
  ],
  "RemoBell S": [
    { id: '1', name: 'SimpliSafe Chime', price: 50, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
    { id: '2', name: 'SimpliSafe Plug Adapter', price: 30, image: '/images/doorbell/accessories/Ring Plug Adapter.jpeg' },
    { id: '3', name: 'SimpliSafe Solar Panel', price: 20, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
  ]
  // Add more doorbells and their accessories as needed
};

function SmartDoorbell() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedDoorbell, setSelectedDoorbell] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);

  // Filter products by category
  const doorbells = products ? products.filter(product => product.category === 'Smart Doorbells') : [];

  useEffect(() => {
    if (selectedDoorbell) {
      // Get the accessories based on the selected doorbell
      const accessoryData = accessoriesData[selectedDoorbell.name] || [];
      setAccessories(accessoryData);
    }
  }, [selectedDoorbell]);

  const handleImageClick = (doorbell) => {
    setSelectedDoorbell(doorbell);
    setQuantity(1); // Reset quantity when selecting a new doorbell
  };

  const handleQuantityChange = (amount, item) => {
    if (item) {
      const newQuantity = Math.max(1, quantity + amount);
      setQuantity(newQuantity);
      updateItemQuantity(item.id, newQuantity);
    }
  };

  const isInCart = (item) => cart ? cart.some(cartItem => cartItem.id === item.id) : false;

  const handleAddToCart = (item) => {
    if (item) {
      addToCart(item);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="smart-doorbell-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Doorbells</h2>
        <div className="product-gallery">
          {doorbells.length > 0 ? (
            doorbells.map((doorbell) => (
              <div key={doorbell.id} className="product-item">
                <img
                  src={doorbell.image}
                  alt={doorbell.name}
                  onClick={() => handleImageClick(doorbell)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{doorbell.name}</h4>
                <p>Price: ${doorbell.price}</p>
                <div className="button-container">
                  {isInCart(doorbell) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, doorbell)}>-</button>
                      <input
                        type="text"
                        className="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button onClick={() => handleQuantityChange(1, doorbell)}>+</button>
                      <button onClick={() => handleRemoveFromCart(doorbell.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(doorbell)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart doorbells available.</p>
          )}
        </div>

        {/* Display selected doorbell details and accessories */}
        {selectedDoorbell && (
          <div className="selected-doorbell">
            <h3>{selectedDoorbell.name}</h3>
            <img src={selectedDoorbell.image} alt={selectedDoorbell.name} className="selected-image" />
            <p>{selectedDoorbell.description}</p>
            <p>Price: ${selectedDoorbell.price}</p>
            <div className="button-container">
              {isInCart(selectedDoorbell) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedDoorbell)}>-</button>
                  <input
                    type="text"
                    className="quantity"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={() => handleQuantityChange(1, selectedDoorbell)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedDoorbell.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedDoorbell)}>Add to Cart</button>
              )}
            </div>

            <div className="accessories">
              <h4>Accessories</h4>
              {accessories.length > 0 ? (
                <div className="accessories-gallery">
                  {accessories.map((accessory) => (
                    <div key={accessory.id} className="accessories-item">
                      <img src={accessory.image} alt={accessory.name} className="accessories-image"/>
                      <h4>{accessory.name}</h4>
                      <p>Price: ${accessory.price}</p>
                      <div className="button-container">
                        {isInCart(accessory) ? (
                          <div className="quantity-controls">
                            <button onClick={() => handleQuantityChange(-1, accessory)}>-</button>
                            <input
                              type="text"
                              className="quantity"
                              value={quantity}
                              readOnly
                            />
                            <button onClick={() => handleQuantityChange(1, accessory)}>+</button>
                            <button onClick={() => handleRemoveFromCart(accessory.id)}>Remove from Cart</button>
                          </div>
                        ) : (
                          <button onClick={() => handleAddToCart(accessory)}>Add to Cart</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No accessories available for this doorbell.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartDoorbell;
