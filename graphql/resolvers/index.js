const argon2 = require('argon2');

const Event = require('model/event.model');
const User = require('model/user.model');

const getEvents = async eventsIds => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });

    return events.map(event => ({
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: getUser.bind(this, event._doc.creator),
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: getEvents.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

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
  createUser: async ({
    userInput: {
      email,
      password,
    },
  }) => {
    try {
      const existUser = await User.findOne({ email });
      if (existUser) {
        throw new Error('User exists already!');
      }
      const hashedPassword = await argon2.hash(
        password,
        {
          type: argon2.argon2id,
          saltLength: 12,
        },
      );
      const user = new User({
        email,
        password: hashedPassword,
      });
      await user.save();
      return {
        ...user._doc,
        password: null,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
