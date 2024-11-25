import mongoose from "mongoose";

// Connect to the database
const connectDB = async (url: string) => {
    await mongoose.connect(url, {

    });
    return true;
}

export default connectDB;