import cron from "node-cron";
import User from "../models/User";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI as string);

cron.schedule("* * * * *", async () => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 100);

    const inactiveUsers = await User.find({
      lastLogin: { $lt: thresholdDate },
      status: "active",
    });

    if (inactiveUsers.length > 0) {
      await User.updateMany(
        { lastLogin: { $lt: thresholdDate } },
        { $set: { status: "inactive" } }
      );
      
    } else {
      console.log("No inactive users found.");
    }
  } catch (error) {
    console.error("Error updating inactive users:", error);
  }
});
