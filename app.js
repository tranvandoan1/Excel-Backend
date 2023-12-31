import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import cors from "cors";
import dataMonthRoutes from "./routes/DataMonth";
import dataUploadImage from "./routes/UploadImage";

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dpfzwa6fo",
  api_key: "785344461972688",
  api_secret: "DcjrSpwI_j8Dwaw7-c9OiJ2e0yo",
  secure: true,
});
const app = express();

dotenv.config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(expressValidator());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("thành công!");
  })
  .catch((err) => {
    console.log(`db error ${err.message}`);
    process.exit(-1);
  });
//Connection

mongoose.connection.on("error", (err) => {
  console.log(`data connect failed, ${err.message}`);
});

// routes
app.use("/api", dataMonthRoutes);
app.use("/api", dataUploadImage);


// listen
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Thanh cong", port);
});
