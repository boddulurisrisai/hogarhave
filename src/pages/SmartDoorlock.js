import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext

// Hardcoded accessories data
const accessoriesData = {
  "August Smart Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Schlage Encode": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Yale Assure Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Level Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "UltraloqU Bolt": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
};

function SmartDoorlock() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedDoorlock, setSelectedDoorlock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState({});
  
  // Filter products by category
  const doorlocks = products ? products.filter(product => product.category === 'Smart Doorlocks') : [];

  useEffect(() => {
    if (selectedDoorlock) {
      const accessoryData = accessoriesData[selectedDoorlock.name] || [];
      setAccessories(accessoryData);
      // Initialize accessory quantities
      const initialQuantities = accessoryData.reduce((acc, accessory) => {
        acc[accessory.id] = 1;
        return acc;
      }, {});
      setSelectedAccessories(initialQuantities);
    }
  }, [selectedDoorlock]);

  const handleImageClick = (doorlock) => {
    setSelectedDoorlock(doorlock);
    setQuantity(1); // Reset quantity when selecting a new doorlock
  };

  const handleQuantityChange = (amount, item) => {
    if (item) {
      const newQuantity = Math.max(1, quantity + amount); // Ensure quantity is at least 1
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

  const handleAccessoryQuantityChange = (amount, accessory) => {
    if (accessory) {
      const newQuantity = Math.max(1, (selectedAccessories[accessory.id] || 1) + amount);
      setSelectedAccessories(prevQuantities => ({
        ...prevQuantities,
        [accessory.id]: newQuantity,
      }));
    }
  };

  return (
    <div className="smart-doorlock-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Doorlocks</h2>
        <div className="product-gallery">
          {doorlocks.length > 0 ? (
            doorlocks.map((doorlock) => (
              <div key={doorlock.id} className="product-item">
                <img
                  src={doorlock.image}
                  alt={doorlock.name}
                  onClick={() => handleImageClick(doorlock)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{doorlock.name}</h4>
                <p>Price: ${doorlock.price}</p>
                <div className="button-container">
                  {isInCart(doorlock) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, doorlock)}>-</button>
                      <input
                        type="text"
                        className="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button onClick={() => handleQuantityChange(1, doorlock)}>+</button>
                      <button onClick={() => handleRemoveFromCart(doorlock.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(doorlock)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart doorlocks available.</p>
          )}
        </div>

        {/* Display selected doorlock details and accessories */}
        {selectedDoorlock && (
          <div className="selected-doorlock">
            <h3>{selectedDoorlock.name}</h3>
            <img src={selectedDoorlock.image} alt={selectedDoorlock.name} className="selected-image" />
            <p>{selectedDoorlock.description}</p>
            <p>Price: ${selectedDoorlock.price}</p>
            <div className="button-container">
              {isInCart(selectedDoorlock) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedDoorlock)}>-</button>
                  <input
                    type="text"
                    className="quantity"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={() => handleQuantityChange(1, selectedDoorlock)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedDoorlock.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedDoorlock)}>Add to Cart</button>
              )}
            </div>

            <div className="accessories">
              <h4>Accessories</h4>
              {accessories.length > 0 ? (
                <div className="accessories-gallery">
                  {accessories.map((accessory) => (
                    <div key={accessory.id} className="accessory-item">
                      <img src={accessory.image} alt={accessory.name} className="accessory-image"/>
                      <h4>{accessory.name}</h4>
                      <p>Price: ${accessory.price}</p>
                      <div className="button-container">
                        {isInCart(accessory) ? (
                          <div className="quantity-controls">
                            <button onClick={() => handleAccessoryQuantityChange(-1, accessory)}>-</button>
                            <input
                              type="text"
                              className="quantity"
                              value={selectedAccessories[accessory.id] || 1}
                              readOnly
                            />
                            <button onClick={() => handleAccessoryQuantityChange(1, accessory)}>+</button>
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
                <p>No accessories available for this doorlock.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartDoorlock;
