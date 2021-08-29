const Booking = require('model/booking.model');

const { getUser, singleEvent } = require('graphql/resolvers/methods');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => ({
        ...booking._doc,
        _id: booking.id,
        user: getUser.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
