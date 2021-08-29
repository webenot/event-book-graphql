const argon2 = require('argon2');

const User = require('model/user.model');

const { transformUser } = require('graphql/resolvers/transformers');

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
      const result = await user.save();
      return transformUser(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
