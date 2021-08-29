const Booking = require('model/booking.model');

const { transformBooking } = require('graphql/resolvers/transformers');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => transformBooking(booking));
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
