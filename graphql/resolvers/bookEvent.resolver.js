const Booking = require('model/booking.model');
const Event = require('model/event.model');
const User = require('model/user.model');

module.exports = {
  bookEvent: async ({ eventId }) => {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found!');
      }
      const user = await User.findById('61066fd4ac5e4633600a381c');
      if (!event) {
        throw new Error('User not found!');
      }
      const booking = new Booking({
        user,
        event,
      });

      const result = await booking.save();

      return ({
        ...result._doc,
        _id: result.id,
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
