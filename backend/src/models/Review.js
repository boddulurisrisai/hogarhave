const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  customerId: { type: String, required: true }, // If you want to store the reviewer's ID
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
  reviewText: { type: String, required: true }, // Review text
  reviewDate: { type: Date, default: Date.now }, // Timestamp of the review
});

module.exports = mongoose.model('Review', reviewSchema);