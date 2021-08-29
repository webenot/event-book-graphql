const { events, createEvent } = require('graphql/resolvers/event.resolver');
const { bookings, bookEvent, cancelBooking } = require('graphql/resolvers/booking.resolver');
const { createUser } = require('graphql/resolvers/user.resolver');

module.exports = {
  events,
  bookings,
  createEvent,
  createUser,
  bookEvent,
  cancelBooking,
};
