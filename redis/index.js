const client = require("redis").createClient();

const RedisUser = require("./users");
const redisuser = new RedisUser(client);

const connect = () => {
  client
    .connect()
    .then(() => {
      console.log("redis client connected...");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  connect,
  users: redisuser,
};
