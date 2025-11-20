import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jagadeeshbabu254_db_user:Jaga123@lms.pt2xd3i.mongodb.net/LMS"
    );
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

export default connectDB;
