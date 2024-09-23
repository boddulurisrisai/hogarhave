import React, { useState } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext

const accessoriesData = {
  "Nest Learning Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Ecobee SmartThermostat with Voice Control": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
   ],
  "Honeywell Home T9 Smart Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Lux Kono": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Emerson Sensi Touch Wi-Fi Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ]
  // Add more thermostat models with accessories as needed
};

function SmartThermostat() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedThermostat, setSelectedThermostat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAccessories, setSelectedAccessories] = useState({});

  // Filter products by category
  const thermostats = products ? products.filter(product => product.category === 'Smart Thermostats') : [];

  const handleImageClick = (thermostat) => {
    setSelectedThermostat(thermostat);
    setQuantity(1); // Reset quantity when selecting a new thermostat
    setSelectedAccessories({}); // Reset accessories when selecting a new thermostat
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

  // Handle adding/removing accessories
  const handleAccessoryChange = (accessory, add) => {
    if (add) {
      setSelectedAccessories((prev) => ({ ...prev, [accessory.id]: accessory }));
    } else {
      const updatedAccessories = { ...selectedAccessories };
      delete updatedAccessories[accessory.id];
      setSelectedAccessories(updatedAccessories);
    }
  };

  return (
    <div className="smart-thermostat-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Thermostats</h2>
        <div className="product-gallery">
          {thermostats.length > 0 ? (
            thermostats.map((thermostat) => (
              <div key={thermostat.id} className="product-item">
                <img
                  src={thermostat.image}
                  alt={thermostat.name}
                  onClick={() => handleImageClick(thermostat)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{thermostat.name}</h4>
                <p>Price: ${thermostat.price}</p>
                <div className="button-container">
                  {isInCart(thermostat) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, thermostat)}>-</button>
                      <input
                        type="text"
                        className="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button onClick={() => handleQuantityChange(1, thermostat)}>+</button>
                      <button onClick={() => handleRemoveFromCart(thermostat.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(thermostat)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart thermostats available.</p>
          )}
        </div>

        {/* Display selected thermostat details and hardcoded accessories */}
        {selectedThermostat && (
          <div className="selected-thermostat">
            <h3>{selectedThermostat.name}</h3>
            <img src={selectedThermostat.image} alt={selectedThermostat.name} className="selected-image" />
            <p>{selectedThermostat.description}</p>
            <p>Price: ${selectedThermostat.price}</p>
            <div className="button-container">
              {isInCart(selectedThermostat) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedThermostat)}>-</button>
                  <input
                    type="text"
                    className="quantity"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={() => handleQuantityChange(1, selectedThermostat)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedThermostat.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedThermostat)}>Add to Cart</button>
              )}
            </div>

            <div className="accessories">
              <h4>Accessories</h4>
              {accessoriesData[selectedThermostat.name] && accessoriesData[selectedThermostat.name].length > 0 ? (
                <div className="accessories-gallery">
                  {accessoriesData[selectedThermostat.name].map((accessory) => (
                    <div key={accessory.id} className="accessory-item">
                      <img src={accessory.image} alt={accessory.name} className="accessory-image"/>
                      <h4>{accessory.name}</h4>
                      <p>Price: ${accessory.price}</p>
                      <div className="button-container">
                        {selectedAccessories[accessory.id] ? (
                          <button onClick={() => handleAccessoryChange(accessory, false)}>Remove</button>
                        ) : (
                          <button onClick={() => handleAccessoryChange(accessory, true)}>Add</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No accessories available for this thermostat.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartThermostat;
