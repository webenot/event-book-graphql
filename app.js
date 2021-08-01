const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('model/event.model');

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
    }
    
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }
  
    type RootQuery {
      events: [Event!]!
    }
    
    type RootMutation {
      createEvent(eventInput: EventInput): Event
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
      },
    }) => {
      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
      });

      return event.save()
        .then(result => ({ ...result._doc }))
        .catch(error => {
          console.error(error);
          throw error;
        });
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
