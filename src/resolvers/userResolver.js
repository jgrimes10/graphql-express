import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export default {
  Query: {
    user: async (parent, { id }, { models: { userModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }

      return await userModel.findById({ _id: id }).exec();
    },
    login: async (
      parent,
      { name, password },
      { models: { userModel } },
      info
    ) => {
      const user = await userModel.findOne({ name }).exec();

      if (!user) {
        throw new AuthenticationError('Invalid login');
      }

      const matchPasswords = bcrypt.compareSync(password, user.password);

      if (!matchPasswords) {
        throw new AuthenticationError('Invalid login');
      }

      const token = jwt.sign({ id: user.id }, 'Sup3rS3cr3t!', {
        expiresIn: 24 * 10 * 50,
      });

      user.lastLogin = Date.now();

      await user.save();

      return { token };
    },
  },
  Mutation: {
    createUser: async (
      parent,
      { name, password },
      { models: { userModel } },
      info
    ) => {
      return await userModel.create({ name, password });
    },
  },
  User: {
    posts: async ({ id }, args, { models: { postModel } }, info) => {
      return await postModel.find({ author: id }).exec();
    },
  },
};
