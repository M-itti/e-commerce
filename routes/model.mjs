import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 500
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  availability: {
    type: Boolean,
    required: true,
    default: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Indoor Plants', 'Outdoor Plants']
  },
  subcategory: {
    type: String,
    required: true,
    trim: true,
    enum: ['Flowers', 'Plant Accessories', 'Herbs', 'Trees', 'Cacti', 'Succulents', 'Medicinial Plants', 'Carnivorous Plants']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  material: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  weight: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

export { Product, User };
