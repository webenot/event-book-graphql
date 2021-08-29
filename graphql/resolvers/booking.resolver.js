const Booking = require('model/booking.model');

const { transformBooking, transformEvent } = require('graphql/resolvers/transformers');

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
