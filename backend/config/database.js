import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


// process.env.MONGO_LOCAL
 async function connectDatabase() {
    try {
        await  mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

    }catch(e) {
        console.log(`Error connecting to database ${e.message}`);
        process.exit(1) //process code 1 for failure, 0 for success
  }
    
   

}
export default connectDatabase;
