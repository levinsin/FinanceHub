import dotenv from "dotenv";
import 'dotenv/config';
// dotenv.config({
//     path: './.env'
// });
dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });
import connectDB from "./config/database.js";
import app from "./app.js";

const startServer = async () => {
  try {
            console.log("JWT_SECRET=", process.env.JWT_SECRET);
           console.log("MONGODB_URI:", process.env.MONGODB_URI);
           await connectDB();

        app.on("error", (error) => {    // to check if there are any errors 
        console.log("ERROR", error);
        throw error;
    });


    app.listen(process.env.PORT || 8000, () => {   // app will listen
        console.log(` Server is running at port :     
            ${process.env.PORT}`);                 

    });
} catch (err) {
    console.log("MONGO db connection failed !!! ", err);
    
}
}

startServer();
