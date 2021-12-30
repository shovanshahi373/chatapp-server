var app = require("express")();
const cors = require("cors");
app.use(cors());
var http = require("http").createServer(app);
const PORT = 8085;
var io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

io.on("connection", (socket) => {
  /* socket object may be used to send specific messages to the new connected client */

  console.log("new client connected");
});
