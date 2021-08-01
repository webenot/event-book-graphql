const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const Event = require('model/event.model');
const User = require('model/user.model');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }
    
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: String!
    }
    
    type User {
      _id: String!
      email: String!
      password: String
    }
    
    input UserInput {
      email: String!
      password: String!
    }
  
    type RootQuery {
      events: [Event!]!
    }
    
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => Event.find()
      .then(result => result.map(event => ({ ...event._doc })))
      .catch(error => {
        console.error(error);
        throw error;
      }),
    createEvent: ({
      eventInput: {
        title,
        description,
        price,
        date,
        creator,
      },
    }) => {
      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
        creator,
      });

      return event.save()
        .then(result => ({ ...result._doc }))
        .catch(error => {
          console.error(error);
          throw error;
        });
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
  },
  graphiql: process.env.NODE_ENV === 'development',
}));

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
)
  .then(() => {
    console.log('Mongo DB connected successfully');
    const PORT = Number(process.env.PORT) || 5000;

    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
