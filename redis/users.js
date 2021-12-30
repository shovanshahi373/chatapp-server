class User {
  constructor(client) {
    this.client = client;
  }

  async getAllUsers() {
    try {
      let users = await this.client.get("users");
      users = users ? JSON.parse(users) : [];
      return users;
    } catch (err) {
      throw err;
    }
  }

  async isValidUserName(user) {
    try {
      let users = await this.getAllUsers();
      console.log({ users });
      const isUnique = !users.some((u) => u.name === user);
      if (!isUnique) throw new Error("username is already taken!");
    } catch (err) {
      throw err;
    }
  }

  async setUser(user) {
    try {
      const users = await this.getAllUsers();
      await this.client.set("users", JSON.stringify([...users, user]));
    } catch (err) {
      throw err;
    }
  }

  async createUser(user) {
    try {
      const users = await this.getAllUsers();
      const isUnique = !users.some((u) => u.name === user.name);
      if (!isUnique) {
        console.log("username already taken!");
        return users;
      }
      const newusers = [...users, { ...user }];
      await this.client.set("users", JSON.stringify(newusers));
      return newusers;
    } catch (err) {
      throw err;
    }
  }
  async deleteUser(id) {
    try {
      const users = await this.getAllUsers();
      const filteredusers = users.filter((u) => u.id !== id);
      await this.client.set("users", JSON.stringify(filteredusers));
      return filteredusers;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
