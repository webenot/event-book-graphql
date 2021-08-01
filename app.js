const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }
    
    type RootMutation {
      createEvent(name: String): String
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => [ 'Romantic Cooking', 'Sailing', 'All Night Coding' ],
    createEvent: ({ name }) => name,
  },
  graphiql: process.env.NODE_ENV === 'development',
}));

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
