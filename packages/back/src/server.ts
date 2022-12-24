import express, { Application } from "express";
import mongoose from "mongoose";
import options from "./settings/swagger";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import router from "./router";
import "./settings/env";

const { MONGO_URI } = process.env;
const corsOptions = {
  origin: ["http://localhost:3000"],
};

const app: Application = express();
// mongoose <-> MongoDB 연결
// Async/Await으로 리팩토링하기
mongoose
  .set("strictQuery", false)
  .connect(MONGO_URI as string, { dbName: "blog" })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

// body-parser like
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors(corsOptions));
app.use("/api/v1", router);

app.listen(8000, () => {
  console.log("server start!");
});
