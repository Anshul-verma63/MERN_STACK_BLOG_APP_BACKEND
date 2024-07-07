import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/userRoute.js";
import dbConnect from "./db/dbConnections.js";
import categoryRouter from "./routes/catrgoryRoute.js";

//env file configuration
dotenv.config();

const app = express();

//middleware
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//rest api
app.get("/", (req, res) => {
  res.send("i am server");
});
app.use("/api/v1/user", router);
app.use("/api/v1/category", categoryRouter);

//connect server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//database connection
dbConnect();
