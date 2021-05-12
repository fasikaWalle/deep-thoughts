const express = require("express");
const db = require("./config/connection");
<<<<<<< HEAD
const path = require("path");
=======

>>>>>>> ca30d5573044fa97768b8657be4dd9acecb03d6e
const PORT = process.env.PORT || 3001;
const app = express();
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
server.applyMiddleware({ app });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// app.get("*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "./public/404.html"));
// });
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
