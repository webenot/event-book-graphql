const eventResolvers = require('graphql/resolvers/event.resolver');
const bookingResolvers = require('graphql/resolvers/booking.resolver');
const userResolvers = require('graphql/resolvers/user.resolver');

module.exports = {
  ...eventResolvers,
  ...bookingResolvers,
  ...userResolvers,
};
