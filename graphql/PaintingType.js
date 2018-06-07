/*
 *  GraphQL type for Painting
 */

// External dependencies
const graphql = require('graphql');

// Deconstruct objects from graphql
const { GraphQLObjectType, GraphQLString } = graphql;

// Create new GraphQL Object Type and insert fields
const PaintingType = new GraphQLObjectType({
  name: 'Painting',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    technique: { type: GraphQLString }
  })
});

// Export the module
module.exports = PaintingType;
