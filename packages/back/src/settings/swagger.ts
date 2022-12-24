const options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: " product REST API SERVER",
      version: "1.0.0",
      description: "product API with express",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
      },
    ],
  },
  apis: ["./src/settings/swagger.yaml"],
};

export default options;
