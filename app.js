const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
require("dotenv").config();
const SocketAuth = require("./middlewares/socket.auth");

const Redis = require("./redis");

Redis.connect();

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use("/users", require("./routes/users"));

const ports = [8080, 8081];

io.use(SocketAuth);

io.on("connection", (socket) => {
  console.log("a user connected =>", socket.id);

  socket.on("join", async (object) => {
    console.log("someone has joined!");
    try {
      const users = await Redis.users.createUser({
        name: object.name,
        id: socket.id,
      });
      io.emit("users", users);
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("disconnect", async () => {
    console.log(`${socket.id} user disconnected...!`);
    try {
      const users = await Redis.users.deleteUser(socket.id);
      socket.broadcast.emit("users", users);
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("message", (data) => {
    console.log("data recieved!");
    //transmit the data to connected client
    console.log("dataaaaa", { data });
    const destination = data.to;
    //send to your friend
    // io.sockets[destination].emit("message", data);
    socket.broadcast.to(destination).emit("message", data);
    //send to yourself
    socket.emit("message", data);
  });
});

app.get("/", (req, res) => {
  // res.send("hello from port ", process.env.PORT);
  res.status(200).json({ msg: `hello from port ${req.socket.localPort}` });
});

app.use((_req, _res, next) => {
  const error = new Error("file not found!");
  error.status = 404;
  next(error);
});

//other error handler
app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  console.error(error.message);
  res.status(status).send({ error: error.message || "server error!" });
});

// app.listen(8080, () => console.log("connected"));

server.listen(8080, console.log(`> listening on port 8080`));

// ports.forEach(async (port) => {
//   app.listen(port, () => console.log(`> listening on port ${port}`));
//   // server.listen(port, console.log(`> listening on port ${port}`));
// });
