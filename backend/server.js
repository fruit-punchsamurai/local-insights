//importing libaries
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
  cors:{
    origin: "http://127.0.0.1:5500"
  }
});

//importing routes
const authRouter = require("./routes/auth");
const searchRouter = require("./routes/search");
const otpRouter = require("./routes/otp");

//importing config
const { MONGODB_URI, port } = require("./config.js");

mongoose.set("strictQuery", true);

app.use(express.json());

connectDB();

app.use("/auth", authRouter);

app.use("/otp", otpRouter);

app.get("/", async (req, res) => {
  res.send("LOCAL INSIGHTS");
});
app.use("/search", searchRouter);


let guides = new Set(); // to keep track of connected guides
let tourists = new Set(); // to keep track of connected tourists


io.on('connection', socket => {
  // console.log(`A user connected: ${socket.id}`);

  socket.on('role', data => {
    if(data.type === 'tourist') {
      //append tourist to tourist set
      tourists.add(socket);
      console.log(`Tourist connected: ${socket.id}`);

      // handle tourist connections
      //data is the object of template {}
      socket.on('request', data => {
        console.log(`Received request from tourist ${socket.id}: ${JSON.stringify(data)}`);
        // send request to all guides catch and display on client side
        guides.forEach(guideSocket => {
          guideSocket.emit('request', {data, touristInfo: socket.id});
        });
      });
    } else if (role.type === 'guide') {
      // handle guide connections
      guides.add(socket);
      console.log(`Guide connected: ${socket.id}`);

      socket.on('accept', data => {
        // send accept to tourist

      })
    }
    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
      guides.delete(socket);
      tourists.delete(socket);
    });
  });
});

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