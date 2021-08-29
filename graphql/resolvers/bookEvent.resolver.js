const Booking = require('model/booking.model');

const { transformBooking } = require('graphql/resolvers/transformers');

module.exports = {
  bookEvent: async ({ eventId }) => {
    try {
      const booking = new Booking({
        user: '61066fd4ac5e4633600a381c',
        event: eventId,
      });

      const result = await booking.save();

      return transformBooking(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
