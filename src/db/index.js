import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectBD = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n Database connected successfully 
        DB Host : ${connectionInstance.connection.host} \n`);

    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

export default connectBD;