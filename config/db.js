import mongoose from "mongoose";

let connectDB = () => {
  try {
    mongoose
      .connect("mongodb://127.0.0.1:27017")
      .then(() => console.log("DB ulandi..."))
      .catch(console.error());
  } catch (error) {
    throw error;
  }
};
export default connectDB;
