import express from "express";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


// process.env.MONGO_LOCAL
 async function connectDatabase() {
    try {
        await  mongoose.connect("mongodb+srv://evanngugi547:NpWdSlx2EPSobqf8@cluster0.qf2tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Database connected successfully");

    }catch(e) {
        console.log(`Error connecting to database ${e.message}`);
        process.exit(1) //process code 1 for failure, 0 for success
  }
    
   

}
const app = express();
const port = 3000
app.get("/", (req, res) => {
  res.send("Homepage");
 
});
const a = connectDatabase().then(() => {
    app.listen(port, () => {
      console.log(`app listening running at http://localhost:${port}...`);
    });
  })
