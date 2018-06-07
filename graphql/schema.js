/*
 *  GraphQL schema file
 */

// External dependencies
const graphql = require('graphql');

// Local dependencies
const PaintingType = require('./PaintingType');
const Painting = require('./../models/Painting');

// Deconstructing
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = graphql;

// Define new GraphQL Object Type
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    painting: {
      type: PaintingType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Painting.findById(args.id)
      }
    }
  }
});

// Export the module
module.exports = new GraphQLSchema({
  query: RootQuery
});
