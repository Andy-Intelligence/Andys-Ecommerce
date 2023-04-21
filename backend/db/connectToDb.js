const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected" + connection.connection.host);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };


const connectDB = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URI)
      console.log("MongoDB connected" + connection.connection.host)
      resolve(connection)
    }
    catch (error) {
      reject(error)
      console.log(error)
      process.exit(1)
    }

    
  })
}

module.exports = connectDB;
