const { transformEvent } = require('graphql/resolvers/transformers');

const Event = require('model/event.model');
const User = require('model/user.model');

module.exports = {
  events: async () => {
    const events = await Event.find();

    return events.map(event => transformEvent(event));
  },
  createEvent: async ({
    eventInput: {
      title,
      description,
      price,
      date,
    },
  }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error('User not found!');
    }

    const event = new Event({
      title,
      description: description || '',
      price: price || 0,
      date: new Date(date),
      creator: req.user._id,
    });

    const result = await event.save();

    user.createdEvents.push(result);
    await user.save();

    return transformEvent(result);
  },
};
