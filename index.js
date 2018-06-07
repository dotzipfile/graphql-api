/*
 *  Entry point for API
 */

// Native Dependencies
const fs = require('fs');

// External Dependencies
const hapi = require('hapi');
const mongoose = require('mongoose');

// Local dependencies
const Painting = require('./models/Painting');

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
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        return `<h1>My GraphQL API`;
      }
    },
    {
      method: 'GET',
      path: '/api/v1/paintings',
      handler: (req, reply) => {
        return Painting.find();
      }
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      handler: (req, reply) => {
        const { name, url, techniques } = req.payload;
        const painting = new Painting({
          name,
          url,
          techniques
        });

        return painting.save();
      }
    }
  ]);

  // Start server
  await server.start();
  console.log(`Server running at: ${ server.info.uri }`);
};

// Call init
init();
