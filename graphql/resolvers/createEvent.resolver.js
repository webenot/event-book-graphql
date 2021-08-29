const { getUser } = require('graphql/resolvers/methods');

const User = require('model/user.model');
const Event = require('model/event.model');

module.exports = {
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

      await event.save();

      user.createdEvents.push(event);
      await user.save();

      return ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator),
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
