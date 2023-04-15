db.createUser({
  user: "readAndWriteAnyUser",
  pwd: "paaSW0rD1",
  roles: [{ role: "readWrite", db: "eukarpia" }],
});

db.createCollection("users");
