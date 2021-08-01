const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require('dotenv').config();

const EVENTS = [
  {
    _id: '1',
    title: 'Romantic Cooking',
    description: 'Romantic Cooking description',
    price: 10,
    date: '01-08-2021',
  },
  {
    _id: '2',
    title: 'Sailing',
    description: 'Sailing description',
    price: 20,
    date: '02-08-2021',
  },
  {
    _id: '3',
    title: 'All Night Coding',
    description: 'All Night Coding description',
    price: 30,
    date: '03-08-2021',
  },
];

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
    events: () => EVENTS,
    createEvent: ({
      eventInput: {
        title,
        description,
        price,
        date,
      },
    }) => {
      const event = {
        _id: Math.random().toString(),
        title,
        description,
        price,
        date,
      };
      EVENTS.push(event);
      return event;
    },
  },
  graphiql: process.env.NODE_ENV === 'development',
}));

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
