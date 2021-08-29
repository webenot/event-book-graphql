const Booking = require('model/booking.model');

const { getUser } = require('graphql/resolvers/methods');

module.exports = {
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      if (!booking) {
        throw new Error('Booking not found');
      }
      const event = {
        ...booking._doc.event._doc,
        _id: booking._doc.event.id,
        creator: getUser.bind(this, booking._doc.event._doc.creator),
      };

      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
