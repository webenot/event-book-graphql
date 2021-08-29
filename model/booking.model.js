const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    index: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  canceled: {
    type: Boolean,
    index: true,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
