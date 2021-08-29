const { buildSchema } = require('graphql');

const schema = require('graphql/schema/schema.graphql');

module.exports = buildSchema(schema);
