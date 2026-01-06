
import 'dotenv/config'
import connectBD from "./db/connectdb.js";
import { app } from "./app.js";

connectBD().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
});








/*
(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",()=>{
        console.log("Error in connecting to database")
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
       })
    }    catch (error) {
        console.error("Database connection failed",error)
        throw error
    }

})()
    */




