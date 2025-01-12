import { logger } from "../../logger";
import mongoose from "mongoose";

// Connect to the database
export const connectDB = async (url: string) => {
    mongoose.connection.on('connected', () => {
        logger.info('connected to mongoDB')
    })

    mongoose.connection.on('error', (err) => {
        logger.error('Database error', err)
    })

    mongoose.connection.on('disconnected', (err) => {
        logger.error('database dissconnected', err)
    })

   await mongoose.connect(url, {});

   return true;
};

