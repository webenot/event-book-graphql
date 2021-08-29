const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('model/user.model');

const { transformUser } = require('graphql/resolvers/transformers');

module.exports = {
  createUser: async ({
    userInput: {
      email,
      password,
    },
  }) => {
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
  },
  login: async ({
    email,
    password,
  }) => {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new Error('User not found!');
    }
    const verifyPassword = await argon2.verify(existUser._doc.password, password);
    if (!verifyPassword) {
      throw new Error('Password is incorrect!');
    }

    const token = jwt.sign({
      userId: existUser.id,
      email: existUser._doc.email,
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    return {
      userId: existUser.id,
      token,
      tokenExpiration: 1,
    };
  },
};
