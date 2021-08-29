const { transformEvent } = require('graphql/resolvers/transformers');

const Event = require('model/event.model');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(event => transformEvent(event));
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
