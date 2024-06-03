const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Mageno Express Api with swagger",
      version: "0.1.0",
      description:
        "This is a simple money transfer application api's with express",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Maximilien",
        email: "maxtamko74@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "user/routes.js",
    "contact/routes.js",
    "credit-card/routes.js",
    "litigation/routes.js",
    "notification/routes.js",
    "transaction/routes.js",
  ],
  securities:{
    bearer:{
      type:'http',
      in:'header',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }

  },
   
  initOAuth:{
    scopes:{}
  }
};
module.exports = options;
