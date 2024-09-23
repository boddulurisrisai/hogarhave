const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Import the Review model

// POST: Submit a review
router.post('/', async (req, res) => {
  const { productId, productName, customerId, rating, reviewText } = req.body;

  if (!productId || !productName || !rating || !reviewText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create a new review
    const newReview = new Review({
      productId,
      productName,
      customerId,
      rating,
      reviewText,
    });

    // Save the review to MongoDB
    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// GET: Fetch all reviews for a specific product
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId });

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
