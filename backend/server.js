//importing libaries
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//importing routes
const authRouter = require("./routes/auth");

//importing config
const { MONGODB_URI, port } = require("./config.js");

mongoose.set("strictQuery", true);

app.use(express.json());

connectDB();

app.use("/auth", authRouter);

app.get("/", async (req, res) => {
  res.send("LOCAL INSIGHTS");
});

// io.on('connection', (socket) => {
//   socket.on('request guides', msg => {
//     io.emit('chat message', msg);
//   });
//   socket.on('create', (room)=>{
//     socket.join(room);
//   });

// });

http.listen(port, () =>
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