import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
// import path from "path";
import authRoutes from "./routes/auth.js";
import slideRoutes from "./routes/slide.js";
import campusRoutes from "./routes/campus.js";
import programRoutes from "./routes/program.js";
import teamRoutes from "./routes/team.js";
import newsRoutes from "./routes/news.js";
import schoolRoutes from "./routes/school.js";
import usersRoutes from "./routes/users.js";


dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Health Check
app.get("/", (req, res) => {
    res.send("The Bugema University API is running fine.");
 });

 app.use("/auth", authRoutes);
 app.use("/slide", slideRoutes)
 app.use("/campus", campusRoutes)
 app.use("/program", programRoutes)
 app.use("/team", teamRoutes)
 app.use("/news", newsRoutes)
 app.use("/school", schoolRoutes)
 app.use("/users", usersRoutes)


 const PORT = process.env.PORT || 6001;
 mongoose
   .connect(process.env.MONGO_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => {
     app.listen(PORT, () => console.log(`Server port: ${PORT}`));
 
     /* ADD DATA ONE TIME */
     // User.insertMany(users);
     // Post.insertMany(posts);
   })
   .catch((error) => console.log(`${error} did not connect`));
   
 