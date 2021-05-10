const jwt = require("jsonwebtoken");
const secret = "mysecretsshhhhh";
const expiration = "2h";
module.exports = {
  signToken: function ({ username, email, _id }) {
    const payLoad = { username, email, _id };
    return jwt.sign({ data: payLoad }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    // if no token, return request object as is
    if (!token) {
      return req;
    }
    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }
    // return updated request object
    return req;
  },
};