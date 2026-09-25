const mongoose = require("mongoose");

const dbConnection = () => {
  return mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.g4h3gtz.mongodb.net/${process.env.MONGODB_DBNAME}?appName=Cluster0`,
    )
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Database Error");
      console.log(err.message);
    });
};

module.exports = dbConnection;
