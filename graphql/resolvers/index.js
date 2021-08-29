const { events } = require('graphql/resolvers/events.resolver');
const { bookings } = require('graphql/resolvers/bookings.resolver');
const { createEvent } = require('graphql/resolvers/createEvent.resolver');
const { createUser } = require('graphql/resolvers/createUser.resolver');
const { bookEvent } = require('graphql/resolvers/bookEvent.resolver');
const { cancelBooking } = require('graphql/resolvers/cancelBooking.resolver');

module.exports = {
  events,
  bookings,
  createEvent,
  createUser,
  bookEvent,
  cancelBooking,
};
