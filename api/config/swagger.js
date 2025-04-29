const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '7 Bank Project API',
      version: '1.0.0',
      description: 'API documentation for 7 Bank Project backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // chỉ định file chứa swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
