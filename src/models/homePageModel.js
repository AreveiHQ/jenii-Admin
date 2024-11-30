const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  images: {
    type: String,
    required: true,
  },
  links: {
    type: String,
    required: true,
  },
  section:{
    type: String,
    enum:["Hero Slider","About Slider","Medal Worthy"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Home = mongoose.models.Homepage||mongoose.model('Homepage', homepageSchema);
module.exports = Home;