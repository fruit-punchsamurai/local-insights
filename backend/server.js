//importing libaries
const express = require("express");
const mongoose = require("mongoose");

//importing routes
const authRouter = require("./routes/auth");

//importing config
const { MONGODB_URI, port } = require("./config.js");

const app = express();
//MONGODB_URI = 0;
mongoose.set("strictQuery", true);

app.use(express.json());

connectDB();

app.use("/auth", authRouter);

app.get("/", async (req, res) => {
  res.send("LOCAL INSIGHTS");
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);

async function connectDB() {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to DB: ${connection.connection.host}`)
  } catch (err) {
    console.log(err);
  }
}