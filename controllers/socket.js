const onMessage = (data) => {
  console.log("data recieved!");
  //transmit the data to connected client
  const destination = data.to;
  //send to your friend
  io.sockets.sockets[destination].emit("message", data);
  //send to yourself
  socket.emit("message", data);
};
