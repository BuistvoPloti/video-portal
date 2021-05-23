const restifySwaggerJsdoc = require('restify-swagger-jsdoc');
const swaggerRouteNamings = require('../resources/routes.js').routes.swagger;
const { application: { apiVersion } } = require('../config');

const initializeSwagger = (server) => {
  restifySwaggerJsdoc.createSwaggerPage({
    definitions: [{ openapi: '3.0.0' }],
    title: 'API documentation',
    version: apiVersion,
    server: server,
    path: swaggerRouteNamings.index,
    apis: [
      './src/routes/users/index.js',
      './src/routes/videos/index.js',
      './src/routes/auth/index.js',
    ]
  });
};

module.exports = initializeSwagger;
