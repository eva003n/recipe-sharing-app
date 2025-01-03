import express, { urlencoded } from "express";
import  connectDatabase  from "./config/database.js";
import connectToRedis from "./config/redis.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import notFound from "./middlewares/404.middleware.js";

dotenv.config();

//app routes
import  authRoutes  from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";

//recipe routes
import recipeRoutes from "./routes/recipes.routes.js";

// notififications route
import notifyRoutes from "./routes/notifications.routes.js";

const port = process.env.PORT || 3000;

export const app = express();

app.use(cors(
  {
    origin: "http://localhost:5173",
    // methods: ["GET"],
    // credentials: true
  }
));
//sets various htpp headers for security purposes
app.use(helmet());
//make working with cookie easy
app.use(cookieParser());


//allow express to handle json data
app.use(express.json());

//Returns middleware that  parses urlencoded bodies especially when workin with form-data 
app.use(urlencoded({ extended: true }));

//handle file uploads
try {
  app.use(  
    fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    abortOnLimit: true
  
  }));
}catch(e) {
  console.log(e.message);
}

app.use((err, req, res, next) => {
  console.log(err.stack);

  res.status(500).json({
    message: `Server error ${err.message}`
  })
})

//URI endpoints
app.use("/api/v1/auth", authRoutes);

//user management
app.use("/api/v1/users", userRoutes);

//recipe management
app.use("/api/v1/recipes", recipeRoutes);

//notification management
app.use("/api/v1/notifications", notifyRoutes);


app.get("/", (req, res) => {
  res.send("Homepage");
 
});
//not found error
app.all("*", notFound)

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`app listening running at http://localhost:${port}...`);
  });
})


 



  

  