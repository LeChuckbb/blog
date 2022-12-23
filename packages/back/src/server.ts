import express, { Application } from "express";
import mongoose from "mongoose";

import router from "./router";
import "./env";

// const { MONGO_URI } = process.env;

const app: Application = express();
// mongoose <-> MongoDB 연결
// Async/Await으로 리팩토링하기
mongoose
  .set("strictQuery", false)
  .connect("mongodb://park:9271@localhost:27017/admin", { dbName: "blog" })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

// body-parser like
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(8000, () => {
  console.log("server start!");
});
