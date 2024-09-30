  import React, { useState, useEffect } from 'react';
  import { useCart } from '../CartContext';
  import Header from '../components/LoginHeader';
  import { useProduct } from '../ProductContext';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';

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
    ]// More doorbells and accessories...
  };

  function SmartDoorbell() {
    const { products } = useProduct();
    const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
    const [selectedDoorbell, setSelectedDoorbell] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [accessories, setAccessories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const navigate = useNavigate();

    const doorbells = products ? products.filter(product => product.category === 'Smart Doorbells') : [];

    useEffect(() => {
      if (selectedDoorbell) {
        const accessoryData = accessoriesData[selectedDoorbell.name] || [];
        setAccessories(accessoryData);
        setReviews([]);
        setShowReviews(false);
      }
    }, [selectedDoorbell]);

    const handleImageClick = (doorbell) => {
      setSelectedDoorbell(doorbell);
      setQuantity(1);
    };

    const handleQuantityChange = (amount, item) => {
      const newQuantity = Math.max(1, quantity + amount);
      setQuantity(newQuantity);
      if (item) updateItemQuantity(item.id, newQuantity);
    };

    const isInCart = (item) => cart ? cart.some(cartItem => cartItem.id === item.id) : false;

    const handleAddToCart = (item) => {
      try {
        addToCart(item);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    const handleRemoveFromCart = (itemId) => {
      try {
        removeFromCart(itemId);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    };
/*
    const handleViewReviews = async () => {
      if (!selectedDoorbell) {
          console.log('No doorbell selected.');
          return;
      }

      try {
          const response = await axios.get(`/api/reviews?ProductModelName=${selectedDoorbell.name}`);
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
  if (selectedDoorbell) {
    navigate('/view-reviews', { state: { productModelName: selectedDoorbell.name } });
  } else {
    console.log('No doorbell selected.');
  }
};
    const handleWriteReview = () => {
      navigate('/write-review', { state: { doorbell: selectedDoorbell } });
    };

    return (
      <div className="smart-doorbell-page">
        <Header />
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
                        <input type="text" className="quantity" value={quantity} readOnly />
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

          {selectedDoorbell && (
            <div className="selected-doorbell">
              <h3>{selectedDoorbell.name}</h3>
              <img src={selectedDoorbell.image} alt={selectedDoorbell.name} className="selected-image" />
              <p>Price: ${selectedDoorbell.price}</p>
              <div className="button-container">
                {isInCart(selectedDoorbell) ? (
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(-1, selectedDoorbell)}>-</button>
                    <input type="text" className="quantity" value={quantity} readOnly />
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
                        <img src={accessory.image} alt={accessory.name} className="accessories-image" />
                        <h4>{accessory.name}</h4>
                        <p>Price: ${accessory.price}</p>
                        <div className="button-container">
                          {isInCart(accessory) ? (
                            <div className="quantity-controls">
                              <button onClick={() => handleQuantityChange(-1, accessory)}>-</button>
                              <input type="text" className="quantity" value={quantity} readOnly />
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

              <div className="reviews-section">
                <h4>Customer Reviews</h4>
                <button onClick={handleViewReviews}>View Reviews</button>

                {showReviews && (
                  <div className="reviews-box">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div key={index} className="review-item">
                          <p>{review.review}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}
                <button onClick={handleWriteReview}>Write a Review</button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  export default SmartDoorbell;
