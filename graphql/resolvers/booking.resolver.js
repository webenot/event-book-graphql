const Booking = require('model/booking.model');

const {
  transformBooking,
  transformEvent,
} = require('graphql/resolvers/transformers');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const bookings = await Booking.find({ user: req.user._id });
    return bookings.map(booking => transformBooking(booking));
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id })
      .populate('event');
    if (!booking) {
      throw new Error('Booking not found');
    }
    const event = transformEvent(booking.event);

    booking.canceled = true;
    await booking.save();

    return event;
  },
};
