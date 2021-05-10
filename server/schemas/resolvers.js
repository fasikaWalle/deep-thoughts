const { Thought, User } = require("../models");
const resolvers = {
  Query: {
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    users: async () => {
      return User.find()
        .select("-_v -password")
        .populate("friends")
        .populate("thoughts");
    },
    user: (parent, { _id }) => {
      return User.findOne({ _id })
        .select("-_v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },
};

module.exports = resolvers;
