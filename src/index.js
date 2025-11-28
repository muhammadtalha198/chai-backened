
import dotenv from "dotenv"
import connectBD from "./db/index.js";
dotenv.config()

connectBD()








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




