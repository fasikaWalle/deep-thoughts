const { Thought, User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
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
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");
        return userData;
      }
      throw new AuthenticationError("not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credential");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { user, token };
    },
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });
        await User.findOneAndUpdate(
          { _id: context._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
        return thought;
      }
      throw new AuthenticationError("you need to logged in");
    },
  },
};

module.exports = resolvers;
