/*
 *  Entry point for API
 */

// Native Dependencies
const fs = require('fs');

// External Dependencies
const hapi = require('hapi');
const mongoose = require('mongoose');

// Read in config details such as username, password and url for mongodb
const sensitiveDataFile = fs.readFileSync('sensitive-data.json', 'utf8');
const configDetails = JSON.parse(sensitiveDataFile);
const mongoDetails = configDetails.mongoDetails;

// Connect to db using config details
mongoose.connect(`mongodb://${mongoDetails.username}:${mongoDetails.password}@${mongoDetails.url}`);

// Log successful connection
mongoose.connection.once('open', () => {
  console.log('Connected to db');
});

// Create server
const server = hapi.server({
  port: 4000,
  host: 'localhost'
});

// Initialise server
const init = async() => {
  // Define / 
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      return `<h1>My GraphQL API`;
    }
  });

  // Start server
  await server.start();
  console.log(`Server running at: ${ server.info.uri }`);
};

// Call init
init();
