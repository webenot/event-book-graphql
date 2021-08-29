const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('graphql/schema');
const graphqlResolvers = require('graphql/resolvers');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
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
