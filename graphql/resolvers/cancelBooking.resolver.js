const Booking = require('model/booking.model');

const { transformEvent } = require('graphql/resolvers/transformers');

module.exports = {
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      if (!booking) {
        throw new Error('Booking not found');
      }
      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
