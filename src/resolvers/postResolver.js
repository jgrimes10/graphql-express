import { AuthenticationError } from 'apollo-server';

export default {
  Query: {
    post: async (parent, { id }, { models: { postModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }

      return await postModel.findById({ _id: id }).exec();
    },
    posts: async (parent, args, { models: { postModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }

      return await postModel.find({ author: me.id }).exec();
    },
  },
  Mutation: {
    createPost: async (
      parent,
      { title, content },
      { models: { postModel }, me },
      info
    ) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }

      return await postModel.create({ title, content, author: me.id });
    },
  },
  Post: {
    author: async ({ author }, args, { models: { userModel } }, info) => {
      return await userModel.findById({ _id: author }).exec();
    },
  },
};
