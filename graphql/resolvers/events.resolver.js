const { getUser } = require('graphql/resolvers/methods');

const Event = require('model/event.model');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator),
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
