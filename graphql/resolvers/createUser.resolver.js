const argon2 = require('argon2');

const User = require('model/user.model');

module.exports = {
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
