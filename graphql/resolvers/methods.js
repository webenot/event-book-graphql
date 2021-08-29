const Event = require('model/event.model');
const User = require('model/user.model');

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found!');
    }
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: getEvents.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found!');
    }

    return {
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: getUser.bind(this, event._doc.creator),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getEvents = async eventsIds => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });

    return events.map(event => ({
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: getUser.bind(this, event._doc.creator),
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = {
  getEvents,
  getUser,
  singleEvent,
};
