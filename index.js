/*
 *  Entry point for API
 */

// Native Dependencies
const fs = require('fs');

// External Dependencies
const hapi = require('hapi');
const mongoose = require('mongoose');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const Inert = require('inert');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');

// Local dependencies
const Painting = require('./models/Painting');
const schema = require('./graphql/schema');
const Pack = require('./package');

// Read in config details such as username, password and url for mongodb
const sensitiveDataFile = fs.readFileSync('sensitive-data.json', 'utf8');
const configDetails = JSON.parse(sensitiveDataFile);
const mongoDetails = configDetails.mongoDetails;

// Create server
const server = hapi.server({
  port: 4000,
  host: 'localhost'
});

// Connect to db using config details
mongoose.connect(`mongodb://${mongoDetails.username}:${mongoDetails.password}@${mongoDetails.url}`);

// Log successful connection
mongoose.connection.once('open', () => {
  console.log('Connected to db');
});

// Initialise server
const init = async() => {
  // Register Inert plugin
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Paintings API Documentation',
          version: Pack.version
        }
      }
    }
  ]);

  // Register hapi-graphql plugin
  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      },
      route: {
        cors: true
      }
    }
  });

  // Register graphqlHapi plugin
  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  });

  // Define routes
  server.route([
    {
      method: 'GET',
      path: '/api/v1/paintings',
      config: {
        description: 'Get all the paintings.',
        tags: [ 'api', 'v1', 'painting' ]
      },
      handler: (req, reply) => {
        return Painting.find();
      }
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      config: {
        description: 'Get a specific painting by ID.',
        tags: [ 'api', 'v1', 'painting' ]
      },
      handler: (req, reply) => {
        const { name, url, technique } = req.payload;
        const painting = new Painting({
          name,
          url,
          technique
        });

        return painting.save();
      }
    }
  ]);

  // Start server
  await server.start();
  console.log(`Server running at: ${ server.info.uri }`);
};

process.on('unHandledRejection', (err) => {
  if(err) {
    console.log(err);
    process.exit(1);
  }
});

// Call init
init();
