import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hardcoded accessories data for smart lighting
const lightingAccessoriesData = {
  "Philips Hue White and Color Ambiance": [
    { id: '1', name: 'Bulb', price: 20, image: '/images/lighting/accessories/Blb.webp' },
    { id: '2', name: 'Led Controller', price: 25, image: '/images/lighting/accessories/LedController.webp' },
    { id: '3', name: 'Socket', price: 11, image: '/images/lighting/accessories/socket.webp' },
  ],
  "LIFX Smart Bulb": [
    { id: '1', name: 'Bulb', price: 20, image: '/images/lighting/accessories/Blb.webp' },
    { id: '2', name: 'Led Controller', price: 25, image: '/images/lighting/accessories/LedController.webp' },
    { id: '3', name: 'Socket', price: 11, image: '/images/lighting/accessories/socket.webp' },
  ],
  "Sengled Smart Bulb": [
    { id: '1', name: 'Bulb', price: 20, image: '/images/lighting/accessories/Blb.webp' },
    { id: '2', name: 'Led Controller', price: 25, image: '/images/lighting/accessories/LedController.webp' },
    { id: '3', name: 'Socket', price: 11, image: '/images/lighting/accessories/socket.webp' },
  ],
  "TP-Link Kasa": [
    { id: '1', name: 'Bulb', price: 20, image: '/images/lighting/accessories/Blb.webp' },
    { id: '2', name: 'Led Controller', price: 25, image: '/images/lighting/accessories/LedController.webp' },
    { id: '3', name: 'Socket', price: 11, image: '/images/lighting/accessories/socket.webp' },
  ],
  "Wyze Bulb": [
    { id: '1', name: 'Bulb', price: 20, image: '/images/lighting/accessories/Blb.webp' },
    { id: '2', name: 'Led Controller', price: 25, image: '/images/lighting/accessories/LedController.webp' },
    { id: '3', name: 'Socket', price: 11, image: '/images/lighting/accessories/socket.webp' },
  ]
};

function SmartLighting() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedLighting, setSelectedLighting] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  // Filter products by category
  const lightings = products ? products.filter(product => product.category === 'Smart Lightings') : [];

  useEffect(() => {
    if (selectedLighting) {
      const accessoryData = lightingAccessoriesData[selectedLighting.name] || [];
      setAccessories(accessoryData);
      // Initialize accessory quantities
      const initialQuantities = accessoryData.reduce((acc, accessory) => {
        acc[accessory.id] = 1;
        return acc;
      }, {});
      setSelectedAccessories(initialQuantities);
    }
  }, [selectedLighting]);

  const handleImageClick = (lighting) => {
    setSelectedLighting(lighting);
    setQuantity(1); // Reset quantity when selecting a new lighting
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
      addToCart({ ...item, quantity }); // Add item with selected quantity
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };
/*
  const handleViewReviews = async () => {
    if (!selectedLighting) {
      console.log('No lighting selected.');
      return;
    }

    try {
      const response = await axios.get(`/api/reviews?ProductModelName=${selectedLighting.name}`);
      
      if (response.data && response.data.reviews) {
        setReviews(response.data.reviews);
      } else {
        setReviews([]);
      }

      setShowReviews(true); // Show the reviews section
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
*/
const handleViewReviews = () => {
  if (selectedLighting) {
    navigate('/view-reviews', { state: { productModelName: selectedLighting.name } });
  } else {
    console.log('No lighting selected.');
  }
};

  const handleWriteReview = () => {
    navigate('/write-review', { state: { lighting: selectedLighting } });
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
    <div className="smart-lighting-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Lightings</h2>
        <div className="product-gallery">
          {lightings.length > 0 ? (
            lightings.map((lighting) => (
              <div key={lighting.id} className="product-item">
                <img
                  src={lighting.image}
                  alt={lighting.name}
                  onClick={() => handleImageClick(lighting)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{lighting.name}</h4>
                <p>Price: ${lighting.price}</p>
                <div className="button-container">
                  {isInCart(lighting) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, lighting)}>-</button>
                      <input
                        type="text"
                        className="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button onClick={() => handleQuantityChange(1, lighting)}>+</button>
                      <button onClick={() => handleRemoveFromCart(lighting.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(lighting)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart lightings available.</p>
          )}
        </div>

        {/* Display selected lighting details and accessories */}
        {selectedLighting && (
          <div className="selected-lighting">
            <h3>{selectedLighting.name}</h3>
            <img src={selectedLighting.image} alt={selectedLighting.name} className="selected-image" />
            <p>{selectedLighting.description}</p>
            <p>Price: ${selectedLighting.price}</p>
            <div className="button-container">
              {isInCart(selectedLighting) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedLighting)}>-</button>
                  <input
                    type="text"
                    className="quantity"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={() => handleQuantityChange(1, selectedLighting)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedLighting.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedLighting)}>Add to Cart</button>
              )}
            </div>

            <div className="accessories">
              <h4>Accessories</h4>
              {accessories.length > 0 ? (
                <div className="accessories-gallery">
                  {accessories.map((accessory) => (
                    <div key={accessory.id} className="accessory-item">
                      <img src={accessory.image} alt={accessory.name} />
                      <h5>{accessory.name}</h5>
                      <p>Price: ${accessory.price}</p>
                      <div className="button-container">
                        <div className="quantity-controls">
                          <button onClick={() => handleAccessoryQuantityChange(-1, accessory)}>-</button>
                          <input
                            type="text"
                            className="quantity"
                            value={selectedAccessories[accessory.id] || 1}
                            readOnly
                          />
                          <button onClick={() => handleAccessoryQuantityChange(1, accessory)}>+</button>
                        </div>
                        <button onClick={() => addToCart({ ...accessory, quantity: selectedAccessories[accessory.id] || 1 })}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No accessories available.</p>
              )}
            </div>

            <div className="reviews">
              <h4>Reviews</h4>
              <button onClick={handleViewReviews}>View Reviews</button>
              <button onClick={handleWriteReview}>Write a Review</button>
              {showReviews && (
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <p>{review.comment}</p>
                        <p>Rating: {review.rating}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartLighting;
