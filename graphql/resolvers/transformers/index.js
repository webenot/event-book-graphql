const User = require('model/user.model');
const Event = require('model/event.model');

const transformUser = user => ({
  ...user._doc,
  _id: user.id,
  password: null,
  createdEvents: getEvents.bind(this, user._doc.createdEvents),
});

const transformEvent = event => ({
  ...event._doc,
  _id: event.id,
  date: new Date(event._doc.date),
  creator: getUser.bind(this, event._doc.creator),
});

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  user: getUser.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: new Date(booking._doc.createdAt),
  updatedAt: new Date(booking._doc.updatedAt),
});

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found!');
    }
    return transformUser(user);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getEvents = async eventsIds => {
  if (!eventsIds || !eventsIds.length) {
    return [];
  }
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });

    return events.map(event => transformEvent(event));
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

    return transformEvent(event);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = {
  transformBooking,
  transformUser,
  transformEvent,
};
