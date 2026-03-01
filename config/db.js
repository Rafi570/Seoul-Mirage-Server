const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const encodedPass = encodeURIComponent(process.env.DB_PASS);
    //   const uri = `mongodb+srv://${process.env.DB_USER}:${encodedPass}@cluster0.mdmdo0u.mongodb.net/smartCse?retryWrites=true&w=majority`;
    // const uri = `mongodb+srv://${process.env.DB_USER}:${encodedPass}@cluster0.mdmdo0u.mongodb.net/smartCse?retryWrites=true&w=majority`;
      const uri = `mongodb+srv://${process.env.DB_USER}:${encodedPass}@cluster0.mdmdo0u.mongodb.net/?appName=Cluster0`;
    const conn = await mongoose.connect(uri, {});
    console.log(`✅ MongoDB Connected via Mongoose: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
