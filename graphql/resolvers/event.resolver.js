const { transformEvent } = require('graphql/resolvers/transformers');

const Event = require('model/event.model');
const User = require('model/user.model');

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
  createEvent: async ({
    eventInput: {
      title,
      description,
      price,
      date,
      creator,
    },
  }) => {
    try {

      const user = await User.findById(creator);

      if (!user) {
        throw new Error('User not found!');
      }

      const event = new Event({
        title,
        description: description || '',
        price: price || 0,
        date: new Date(date),
        creator,
      });

      const result = await event.save();

      user.createdEvents.push(result);
      await user.save();

      return transformEvent(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};