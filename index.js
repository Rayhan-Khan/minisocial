import "dotenv/config";
import express from "express";
import cookie from "cookie-parser";
//import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import path,{dirname} from 'path'
import User from "./route/user.js";
import Post from './route/post.js'
import { fileURLToPath } from "url";
import authUser from "./middleware/authUser.js";
import Follower from './route/follower.js'



const __dirname=dirname(fileURLToPath(
  import.meta.url));

const app = express();
const PORT=process.env.PORT||2000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static/public', express.static(path.join(__dirname, 'uploads')))
app.use(helmet());
app.use(cookie());
/* app.use(
  cors({
    credentials: true,
    origin: "https://minisocialapp.herokuapp.com"
  })
); */


//rout
app.use("/api", User);
app.use("/api",authUser)//auth middleware
app.use('/api',Post);
app.use('/api',Follower);



//error
app.use(function (err, req, res, next) {
  if(process.env.NODE_ENV)
  console.error(err.stack);
  res.status(500).send("Something broke!!!");
});
mongoose.connect(process.env.mongoUrl,(err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connectted");
  }
});

/* if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", function (req, res) {
    res.sendFile(
      path.resolve(__dirname, "frontend,build,index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}  */


  app.use(express.static(path.join(__dirname, "frontend","build")));
  app.get("/*", function (_, res) {
    res.sendFile(
      path.join(__dirname, "frontend","build","index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });

app.listen(PORT, () => console.log("running"));

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
