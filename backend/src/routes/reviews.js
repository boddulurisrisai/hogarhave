// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Submit a review
router.post('/', async (req, res) => {
  const review = new Review(req.body);
  try {
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/*
router.get('/reviews', async (req, res) => {
  const { ProductModelName } = req.query; // Extracting the query parameter

  // Checking if the required query parameter is provided
  if (!ProductModelName) {
      return res.status(400).json({ error: 'ProductModelName query parameter is required' });
  }

  try {
      // Fetching reviews from the database
      const reviews = await Review.find({ ProductModelName: ProductModelName });
      res.json(reviews); // Sending the reviews back as a response
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:doorbellName', async (req, res) => {
  const { doorbellName } = req.params.ProductModelName; // Extract doorbellName directly from req.params
  try {
    // Fetch all reviews related to the doorbell name
    const reviews = await Review.find({ ProductModelName: doorbellName }); // Adjust field name as necessary

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});


router.get('/:doorbellName', async (req, res) => {
  const { doorbellName } = req.params.ProductModelName; // Correctly extract doorbellName from req.params
  try {
    // Fetch reviews from the database based on the doorbell name
    const reviews = await Review.find({ ProductModelName: doorbellName });

    // Check if any reviews were found
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this doorbell' });
    }

    // Return the reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});
*/


module.exports = router;
